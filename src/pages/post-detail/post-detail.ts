import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import { CommentProvider } from '../../providers/comment/comment';
import { UsersServiceProvider } from '../../providers/users-service/users-service';
import { PostServiceProvider } from '../../providers/post-service/post-service';
import { LikeProvider } from '../../providers/like/like';

import * as firebase from 'firebase';

/**
 * Generated class for the PostDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post-detail',
  templateUrl: 'post-detail.html',
  providers:[CommentProvider,UsersServiceProvider,PostServiceProvider,LikeProvider]
})
export class PostDetailPage {

  private userPost : any;
  private targetData : any;
  private postDetail = this;
  private userId = firebase.auth().currentUser.uid;
  private commentList = [];
  private setLikeItInAction : false;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private commentProvider: CommentProvider,
    private loadingController: LoadingController,
    private usersServiceProvider: UsersServiceProvider,
    private postServiceProvider: PostServiceProvider,
    private likeProvider: LikeProvider
  ) {
    if( navParams && navParams.data && navParams.data.targetPost && navParams.data.targetPost){
      this.userPost = navParams.data.targetPost;
    }
    this.getUserPost();
    this.getUser();
    this.getComments();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostDetailPage');
  }

  showCommentPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Comment',
      message: "Add some comments",
      inputs: [
        {
          name: 'comment',
          placeholder: 'comment'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.userPost.comment = data.comment;
            let loader = this.loadingController.create({
              dismissOnPageChange: true,
              content: "Saving comment."
            });
            loader.present();
            this.commentProvider.createComment(this.userPost).then((res) => {
              loader.dismiss().then( (res) => {
                this.getComments();
              });
            }).catch((error) => {
              loader.dismiss();
            });
          }
        }
      ]
    });
    prompt.present();
  }

  getComments() {

    let usersServiceProvider = this.usersServiceProvider;
    let postDetailPage = [];
    this.commentProvider.getComments(this.userPost.postUid).then((snapshot) => {
      snapshot.forEach ( function (childSnapshot) {
          let data = childSnapshot.val();

          usersServiceProvider.getUser(data.userUid).then( res => {
            data.photo = res.val().photo ? res.val().photo : 'img\\default_profile_image.png';
          }).catch( error => {
            data.photo = 'img\\default_profile_image.png';
          });
          postDetailPage.push(data);
      });
      postDetailPage.sort(function(a, b){return b.timeStamp - a.timeStamp});
      this.commentList = postDetailPage;
    });
  }

  getUser() {

    let postDetail = this.postDetail;
    let usersServiceProvider = this.usersServiceProvider;
    usersServiceProvider.getUser(postDetail.userPost.userUid).then( res => {
      postDetail.userPost.photo = res.val().photo ? res.val().photo : 'img\\default_profile_image.png';
      postDetail.userPost.email = res.val().email ? res.val().email : 'email not available';
    }).catch( error => {
      postDetail.userPost.photo = 'img\\default_profile_image.png';
    });
  }

//get the detail of the chosen post
  getUserPost() {
    this.postServiceProvider.getUserPost(this.userPost.postUid, this.postDetail);
  }

  setLikeIt() {
    if(this.userPost){
      this.userPost.likerUid = this.userId;
      this.likeProvider.setLikeIt(this.userPost, this.postDetail);
    };
  }
}
