import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { PostServiceProvider } from '../../providers/post-service/post-service';
import * as firebase from 'firebase';
import { HomePage } from '../home/home';
import { Camera } from '@ionic-native/camera';

/**
 * Generated class for the PostCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post-create',
  templateUrl: 'post-create.html',
  providers:[PostServiceProvider,Camera]
})
export class PostCreatePage {

  public title : any;
  public content : any;
  private userProfile : any;
  private userUid : any;
  private imageData : any;
  private imageUrl : any;
  private imageRef : any;
  private imageSrc : any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private postServiceProvider: PostServiceProvider,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private camera: Camera
  ){
    this.imageRef = firebase.storage().ref('/');
    this.userProfile = firebase.database().ref('users');
    let user = firebase.auth().currentUser;

    if(user){
      this.userUid = user.uid;
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostCreatePage');
  }

  createPost() {

    let loader = this.loadingController.create({
      dismissOnPageChange: true
    });
    loader.present();
    let postData =
                  {
                    userUid : this.userUid,
                    title : this.title,
                    content : this.content,
                    imageUrl : this.imageUrl
                  }
    // this.postServiceProvider.createPost(this.userUid,this.content).then(

    this.postServiceProvider.createPost(postData).then(
      res => {
        let alert = this.alertCtrl.create({
          title: 'Posting success',
          subTitle: 'Posting was done successfully',
          buttons: [
            {
              text : 'OK',
              handler: () => {
                loader.dismiss().then(() => {
                  this.navCtrl.push(HomePage);
                });
              }
            }
          ]
        });
        alert.present();
      },
      error => {
        let alert = this.alertCtrl.create({
          title: 'Error Posting',
          subTitle: error.message,
          buttons: ['OK']
        });
        alert.present();
      }
    );
  }

  takePhotos() {
    this.camera.getPicture({
        quality : 10,
        destinationType : this.camera.DestinationType.DATA_URL,
        sourceType : this.camera.PictureSourceType.CAMERA,
        encodingType : this.camera.EncodingType.PNG,
        saveToPhotoAlbum : true
    }).then( imageData => {
      this.imageData = imageData;
      // imageData is a base64 encoded string
      this.imageSrc = "data:image/jpeg;base64," + imageData;
    });
  }

  uploadImage() {

    if(this.imageData){
      let timeStamp = Date.now();
      this.imageRef.child(this.uid()).child('crayon_photo_'+timeStamp+'.png').putString(
        this.imageData,'base64',{contentType:'image/png'}
      ).then( savedImage => {
        this.imageUrl = savedImage.downloadURL
        this.createPost();
      });
    } else {
      this.imageUrl = '';
      this.createPost();
    }

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


}
