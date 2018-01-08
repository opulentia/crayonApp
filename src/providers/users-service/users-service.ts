import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { NavController } from 'ionic-angular';
import 'rxjs/add/operator/map'  // for map method
import * as firebase from 'firebase';

/*
  Generated class for the UsersServiceProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsersServiceProvider {

  private data: any;
  private http: any;
  public userProfile: any;
  public fireAuth: any;
  private userData: any;
  private fireRef: any;

  constructor(
    http : Http,
    navCtrl : NavController
  ){
    this.http = http;
    this.fireAuth = firebase.auth();
    this.fireRef = firebase.database().ref();
    this.userProfile = firebase.database().ref('users');
  }

  loadUser (number) {
    if(this.data){
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get('https://randomuser.me/api/?results='+number)
      .map(res => res.json())
      .subscribe(data => {
        this.data = data.results;
        resolve(this.data);
      });
    });
  }

  registerUser(email : string, password : string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password).then((newUserCreated) => {
      this.fireAuth.signInWithEmailAndPassword(email, password).then((authenticatedUser) => {
        this.userProfile.child(authenticatedUser.uid).set({email:email});
      });
    });
  }

  loginUser(email: string, password: string) : any {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  logoutUser(){
    return this.fireAuth.signOut();
  }

  forgotPasswordUser(email: any) {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  googleSignInUser() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');

    let that = this;

    return firebase.auth().signInWithPopup(provider).then(
      function(result) {
        // test code
        // alert(JSON.stringify(result));
        if(result.user){

          let user = result.user;
          let email = result.user.email ? result.user.email : "";
          let photoURL = result.user.photoURL ? result.user.photoURL : "";
          let displayName = result.user.displayName ? result.user.displayName : "";

          that.userProfile.child(user.uid).set({
            email: email,
            photo: photoURL,
            username: displayName
          });
        } else {
          // TODO : when error occurs
        }
      }
    ).catch(function(error) {
      // test code
      // alert(JSON.stringify(error));
      console.log(error);
    });
  }

  getUser(userId: any){
    let userRef = this.userProfile.child(userId);
    return userRef.once('value');
  }

  // createPost(userUid: any,content: any) {
  updateUserProfile(userData : any) {

    // this.userProfile.child(userData.userUid).update({
    //   photo : userData.imageUrl
    // });

    this.userData = {photo : userData.imageUrl};

    //  write the new post's data sinultaneously in the posts list and the usr's post
    let updatePath = {};
    updatePath['/users/' + userData.userUid] = this.userData;
    // update both tables simultaneously
    return this.fireRef.update(updatePath);

  }
}
