import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'  // for map method
import * as firebase from 'firebase';

/*
  Generated class for the CommentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommentProvider {

  private commentsNode : any;
  private commentData : any;
  private fireRef : any;

  constructor(http:Http) {
    this.commentsNode = firebase.database().ref('comments');
    this.fireRef = firebase.database().ref();
  }

// get all the comments for each post
  getComments(postUid:any) {
    // select from comments
    // --> firebase.database().ref('comments');
    // where postUid = postUid
    // --> orderByChild('postUid').equalTo(postUid);

    let userRef = this.commentsNode.orderByChild('postUid').equalTo(postUid);
    return userRef.once('value');
  }

  createComment(commentData : any) {
    this.commentData = {
        postUid : commentData.postUid,
        userUid : commentData.userUid,
        comment : commentData.comment,
        timeStamp : Date.now()
    }
        // //  create a key for a new post
        let newCommentKey = this.commentsNode.push().key;
        // //  write the new post's data sinultaneously in the posts list and the usr's post
        let updatePath = {};
        updatePath['/comments/' + newCommentKey] = this.commentData;
        // // update the table
        return this.fireRef.update(updatePath);
  }

}
