import { Component } from '@angular/core';
import { NavController,  NavParams } from 'ionic-angular';
import { UsersDetailPage } from '../users-detail/users-detail';
import { PostServiceProvider } from '../../providers/post-service/post-service';
import { UsersServiceProvider } from '../../providers/users-service/users-service';
import { PostCreatePage } from '../post-create/post-create';
import { PostDetailPage } from '../post-detail/post-detail';
import { CommentProvider } from '../../providers/comment/comment';
import { LikeProvider } from '../../providers/like/like';

import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[UsersServiceProvider,PostServiceProvider,CommentProvider,LikeProvider]
})
export class HomePage {

  private userPostList = [];
  private userProfile : any;
  private userName : any;
  private userEmail : any;
  private userPhoto : any;
  private userUid : any;
  private imageSrc : any;
  private targetPost : any;
  private home = this;
  private setLikeItInAction = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private postServiceProvider: PostServiceProvider,
    private usersServiceProvider: UsersServiceProvider,
    private commentProvider: CommentProvider,
    private likeProvider: LikeProvider
  ) {

    this.userProfile = firebase.database().ref('users');
    let homePage = this;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        homePage.userUid = user.uid;
        homePage.listPost();
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  redirectToUserDetailPage() {
    this.navCtrl.push(UsersDetailPage);
  }

  redirectToPostCreatePage() {
    this.navCtrl.push(PostCreatePage);
  }

  listPost() {
    // this.userPostList.length = 0;
    let homePage = this.userPostList;
    this.postServiceProvider.listPost(this.home);

  }

  postDetail(targetPost) {
    this.targetPost = targetPost;
    if(this.targetPost){
      this.navCtrl.push(PostDetailPage,{targetPost:targetPost});
    }
  }

  setLikes(targetPost){
    if(targetPost){
      targetPost.likerUid = this.userUid;
      this.likeProvider.setLikeIt(targetPost, this.home);
    }
  }

}
