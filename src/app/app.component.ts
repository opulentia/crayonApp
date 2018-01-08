import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    var config = {
      apiKey: "AIzaSyCR7LMfhP35yEV33mAX_CwKCctiZg-_PyI",
      authDomain: "fireblogger-dd4ac.firebaseapp.com",
      databaseURL: "https://fireblogger-dd4ac.firebaseio.com",
      projectId: "fireblogger-dd4ac",
      storageBucket: "fireblogger-dd4ac.appspot.com",
      messagingSenderId: "146048340203"
    };
    firebase.initializeApp(config);

    // check loggin status
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        this.rootPage = TabsPage;
      } else {
        this.rootPage = LoginPage;
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
