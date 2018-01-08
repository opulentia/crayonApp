import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'  // for map method
import * as firebase from 'firebase';

/*
  Generated class for the PostServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PostServiceProvider {

  private data: any;
  private userNode : any;
  private fireRef : any;
  private postsNode : any;
  private userPostsNode : any;
  private postData : any;

  constructor(http:Http){
    this.userNode = firebase.database().ref('users');
    this.postsNode = firebase.database().ref('posts');
    this.userPostsNode = firebase.database().ref('userPosts');
    this.data = firebase.database().ref('users');
    this.fireRef = firebase.database().ref();
  }

// get a post content
  getPost(postId:any) {
    let userRef = this.postsNode.child(postId);
    return userRef.once('value');
  }

// fetch all the posts
  listPost(origin){

    let userPostList = origin.userPostList;

    return this.postsNode.on('value', (snapshot) => {
        if(userPostList.length == 0){
          snapshot.forEach ( function (childSnapshot) {
              console.log(JSON.stringify(childSnapshot));
              let data = childSnapshot.val();
              userPostList.push(data);
          });
        } else {

          // for the sake of likes update
          snapshot.forEach ( function (childSnapshot) {
              console.log(JSON.stringify(childSnapshot));
              let data = childSnapshot.val();
              userPostList.forEach ( function (userPostListElement,index) {
                if(userPostListElement.postUid == data.postUid){
                  userPostList[index].likes = data.likes;
                }
              });
          });
        }

          // attaching photo
          let usersServiceProvider = origin.usersServiceProvider;
          let commentProvider = origin.commentProvider;

          userPostList.forEach ( function (post,index) {

            let tempList = [];
            commentProvider.getComments(post.postUid).then((snapshot) => {

              snapshot.forEach ( function (childSnapshot) {
                  let data = childSnapshot.val();
                  tempList.push(data);
              });
              userPostList[index].commentListSize = tempList.length;

              usersServiceProvider.getUser(userPostList[index].userUid).then( res => {
                userPostList[index].photo = res.val().photo ? res.val().photo : 'img\\default_profile_image.png';
              }).catch( error => {
                userPostList[index].photo = 'img\\default_profile_image.png';
              });
            });
          });
    });
  }

  // createPost(userUid: any,content: any) {
  createPost(postData : any) {
    //  create a key for a new post
    let newPostKey = this.postsNode.push().key;

    this.postData = {
        userUid : postData.userUid,
        title : postData.title,
        content : postData.content,
        imageUrl : postData.imageUrl,
        timeStamp : Date.now(),
        postUid : newPostKey,
        likes : 0
    };

//  write the new post's data sinultaneously in the posts list and the usr's post
    let updatePath = {};
    updatePath['/posts/' + newPostKey] = this.postData;
    updatePath['/userPosts/'+this.postData.userUid+'/'+newPostKey] = this.postData;
// update both tables simultaneously
    return this.fireRef.update(updatePath);
  }

  setLikeIt(postData : any) {
    let newLikerKey = this.postsNode.push().key;
    let targetData = { likerUid : postData.userUid }

    let updatePath = {};
    updatePath['/posts/' + postData.postUid + "/likers/" + newLikerKey] = targetData;
// update both tables simultaneously
    return this.fireRef.update(updatePath);
  }

  getLikeItCount(likerUid : any){
    let userRef = this.postsNode.child('').equalTo(likerUid);
    return userRef.once('value');
  }

  // get a post content and watch its change
  getUserPost(postUid: any, postDetail) {
    let userRef = this.postsNode.child(postUid);
    return userRef.on('value', (snapshot) => {
      if(snapshot){
        postDetail.userPost = snapshot.val();
      }
    });
  }
}
