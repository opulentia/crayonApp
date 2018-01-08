import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {

  public username : any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if(navParams && navParams.data && navParams.data.userDetails && navParams.data.userDetails.username){
      this.username = navParams.data.userDetails.username;
    } else {
      this.username = "Anonymous";
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

}
