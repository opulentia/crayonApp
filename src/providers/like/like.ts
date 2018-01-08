import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'  // for map method
import * as firebase from 'firebase';

@Injectable()
export class LikeProvider {

  private likesNode : any;
  private fireRef : any;
  private likesData : any;
  private postsNode : any;
  private likeProvider = this;
  private origin : any;

  constructor(http:Http) {
    this.likesNode = firebase.database().ref('likes/');
    this.postsNode = firebase.database().ref('posts/');
    this.fireRef = firebase.database().ref();
  }

  getLikes(postUid) {
    let userRef = this.likesNode.orderByChild('postUid').equalTo(postUid);
    return userRef.on('value');
  }

  setLikeIt(likesData, origin) {
    this.origin = origin;
    if(!this.origin.setLikeItInAction){
      this.origin.setLikeItInAction = true;
      if(likesData){
        this.likesData = {
          likeIt : false,
          likerUid : likesData.likerUid,
          postUid : likesData.postUid,
        };
        let likeIt = true;
        this.getLike(likesData).then( (snapshot) => {

          if(snapshot.val() != null){

            let keyValue = Object.keys(snapshot.val())[0];
            let childSnapshotVal : any;

            snapshot.forEach ( function (childSnapshot) {
              childSnapshotVal = childSnapshot.val();
              if(
                childSnapshotVal
                && childSnapshotVal.likerUid
                && childSnapshotVal.likerUid == likesData.likerUid
                && childSnapshotVal.likeIt
              ){
                likeIt = false;
              }
            });

            this.likesData.likeIt = likeIt;
            //  create a key for a new post
            let newLikesKey = this.likesNode.push().key;
            //  write the new post's data sinultaneously in the posts list and the usr's post
            let updatePath = {};
            updatePath['/likes/' + keyValue] = this.likesData;
            // update the table
            likesData.userLikeIt = likeIt;
            return this.fireRef.update(updatePath, res => {
              this.likeProvider.updatePostLike(likesData);
            });

          } else {

            this.likesData.likeIt = true;
            //  create a key for a new post
            let newLikesKey = this.likesNode.push().key;
            //  write the new post's data sinultaneously in the posts list and the usr's post
            let updatePath = {};
            updatePath['/likes/' + newLikesKey] = this.likesData;
            // update the table
            return this.fireRef.update(updatePath, res => {
              this.likeProvider.updatePostLike(likesData);
            });
          }

        }).catch( (error) => {
          console.log(error);
        });
      }

    }
  }

  getLike(likesData) {
    let userRef = this.likesNode.orderByChild('postUid').equalTo(likesData.postUid);
    return userRef.once('value');
  }

  updatePostLike(likesData) {

    let likeProvider = this.likeProvider;

    this.getLike(likesData).then( (snapshot) => {
      if(snapshot.val() != null){
        let childSnapshotVal : any;
        let likeProvider = this.likeProvider;
        snapshot.forEach ( function (childSnapshot) {
          childSnapshotVal = childSnapshot.val();
          let postUid = childSnapshotVal.postUid;
          likeProvider.getPost(postUid).then( snapshot => {

            let likesCounter : any;

            if(likesData.userLikeIt == false){
              console.log("likesData.userLikeIt == false");
              likesCounter = snapshot.val().likes - 1;
            } else {
              console.log("likesData.userLikeIt == true");
              likesCounter = snapshot.val().likes + 1;
            }

            let targetData = snapshot.val();
            targetData.likes = likesCounter;

            let updatePath = {};
            updatePath['/posts/' + postUid] = targetData;
            return likeProvider.fireRef.update(updatePath, res => {
              console.log(res);
              console.log("setting updatePostLike >>>>>>>>>>>>>>>>>");
              likeProvider.origin.setLikeItInAction = false;
            });
          }).catch( error => {
            console.log(error);
          })
        });
      }
    }).catch( (error) => {
      console.log(error);
    });
  }

  // get a post content
  getPost(postId:any) {
    let userRef = this.postsNode.child(postId);
    return userRef.once('value');
  }

  getMyLikes(userUid:any) {
    let userRef = this.likesNode.orderByChild('likerUid').equalTo(userUid);
    return userRef.once('value');
  }

}
