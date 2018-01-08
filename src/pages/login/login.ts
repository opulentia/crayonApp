import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController, ToastController} from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { UsersServiceProvider } from '../../providers/users-service/users-service';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers:[UsersServiceProvider]
})
export class LoginPage {

  public emailField : any;
  public passwordField : any;
  private users = [];
  private usersList : any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private usersServiceProvider: UsersServiceProvider,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
    ) {

      // let toast = this.toastCtrl.creat({
      //   message: 'Creating user account',
      //   duration: 3000,
      //   position: 'top'
      // });
      // toast.present();

      // this.listOurUsers();
  }

  registerUser() {
    this.usersServiceProvider.registerUser(this.emailField, this.passwordField).then(
      authData => {
        // test code
        // alert(JSON.stringify(authData));
        this.navCtrl.setRoot(HomePage)
      },
      error => {
        // test code
        // alert(JSON.stringify(error));
        if(error && error.message){
          let alert = this.alertCtrl.create({
            title: 'Registering Failed',
            subTitle: error.message,
            buttons: ['OK']
          });
          alert.present();
        }

        // let loader = this.loadingController.create({
        //   dismissOnPageChange: true
        // });
        // loader.present();
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  listOurUsers() {
    this.usersServiceProvider.loadUser(10).then(data => {
      this.usersList = data;
    });
  }

  submitLogin() {
    this.usersServiceProvider.loginUser(this.emailField, this.passwordField).then(
      authData => {
        // test code
        // alert(JSON.stringify(authData));
        this.navCtrl.setRoot(HomePage)
      },
      error => {
        // test code
        // alert(JSON.stringify(error));
        let alert = this.alertCtrl.create({
          title: 'Login failed',
          subTitle: error.message,
          buttons: ['OK']
        });
        alert.present();
      }
    );

    let loader = this.loadingController.create({
      dismissOnPageChange: true
    });
    loader.present();

  }

  submitRegister() {
    let registerModel = this.modalCtrl.create(RegisterPage);
    registerModel.present();
  }

  showForgotPassword() {
    let prompt = this.alertCtrl.create({
      title: 'Enter Your Email',
      message: 'A new password will be send to your email',
      inputs: [
        {
          name: 'userEmailAddress',
          placeholder: 'youremail@xample.com'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: 'Submit',
          handler: data => {

            let loader = this.loadingController.create({
              dismissOnPageChange: true,
              content: "Resetting password is in progress."
            });
            loader.present();

            this.usersServiceProvider.forgotPasswordUser(data.userEmailAddress).then(
              () => {
                loader.dismiss().then(() => {
                  let alert = this.alertCtrl.create({
                    title: 'Check your email',
                    subTitle: 'Password reset successful',
                    buttons: ['OK']
                  });
                  alert.present();
                });

              },
              (error) => {
                loader.dismiss().then(() => {
                  let alert = this.alertCtrl.create({
                    title: 'Error resetting password',
                    subTitle: error.message,
                    buttons: ['OK']
                  });
                  alert.present();
                });

              }
            );
          }
        }
      ]
    });
    prompt.present();
  }

  googleSignIn() {
    this.usersServiceProvider.googleSignInUser().then( (res) => {
      let toast = this.toastCtrl.create({
        message: 'Creating user account',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

}
