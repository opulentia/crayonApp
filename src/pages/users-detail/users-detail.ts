import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UsersServiceProvider } from '../../providers/users-service/users-service';
import { LoginPage } from '../login/login';
import * as firebase from 'firebase';
import { Camera } from '@ionic-native/camera';

/**
 * Generated class for the UsersDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users-detail',
  templateUrl: 'users-detail.html',
  providers:[UsersServiceProvider,Camera]
})
export class UsersDetailPage {

  private userPhotoUrl: any;
  private userName: any;
  private imageData: any;
  private imageRef : any;
  private userProfile : any;
  private userUid : any;
  private imageUrl : any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private usersServiceProvider: UsersServiceProvider,
    private camera: Camera,
    private loadingController: LoadingController,
    private alertCtrl: AlertController
  ) {
    // let currentUserId = firebase.auth().currentUser.uid;
    // this.getUser(currentUserId);

    this.imageRef = firebase.storage().ref('/');
    this.userProfile = firebase.database().ref('users');
    let user = firebase.auth().currentUser;

    if(user){
      this.userUid = user.uid;
      this.getUser(this.userUid);
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersDetailPage');
  }

  logoutUser() {

    let confirm = this.alertCtrl.create({
      title: 'Logout?',
      message: 'If you wish to logout, press Yes.',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.usersServiceProvider.logoutUser().then(() => {
              this.navCtrl.setRoot(LoginPage);
            });
          }
        }
      ]
    });
    confirm.present();

  }

  getUser (currentUserId) {
    this.usersServiceProvider.getUser(currentUserId).then( res => {
      this.userPhotoUrl = res.val().photo ? res.val().photo : 'img\\default_profile_image.png';
    });
  }

  changePhoto() {
    this.camera.getPicture({
        quality : 10,
        destinationType : this.camera.DestinationType.DATA_URL,
        sourceType : this.camera.PictureSourceType.CAMERA,
        encodingType : this.camera.EncodingType.PNG,
        saveToPhotoAlbum : true
    }).then( imageData => {
      this.imageData = imageData;
      // imageData is a base64 encoded string
      // this.imageSrc = "data:image/jpeg;base64," + imageData;
      this.uploadImage()
    });
  }

  uploadImage() {

    // if(this.imageData){
      let timeStamp = Date.now();
      this.imageRef.child(this.uid()).child('crayon_photo_'+timeStamp+'.png').putString(
        this.imageData,'base64',{contentType:'image/png'}
      ).then( savedImage => {
        this.imageUrl = savedImage.downloadURL
        this.updateUserProfile();
      });
    // } else {
    //   this.imageUrl = '';
    //   this.createPost();
    // }
  }

  uid(){
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  updateUserProfile() {
    let loader = this.loadingController.create({
      dismissOnPageChange: true
    });
    loader.present();
    let userData =
                  {
                    userUid : this.userUid,
                    imageUrl : this.imageUrl
                  }

    this.usersServiceProvider.updateUserProfile(userData).then( (res) => {
      loader.dismiss().then( (res) => {
        this.getUser(this.userUid);
      });
    }).catch( (error) => {
      loader.dismiss().then( (res) => {
        this.getUser(this.userUid);
      });
    });
  }

}
