import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { UsersDetailPage } from '../pages/users-detail/users-detail';
import { PostCreatePage } from '../pages/post-create/post-create';
import { PostDetailPage } from '../pages/post-detail/post-detail';

import { HttpModule } from '@angular/http';

import { PostServiceProvider } from '../providers/post-service/post-service';
import { UsersServiceProvider } from '../providers/users-service/users-service';
import { CommentProvider } from '../providers/comment/comment';
import { LikeProvider } from '../providers/like/like';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    RegisterPage,
    ResetPasswordPage,
    UsersDetailPage,
    PostCreatePage,
    PostDetailPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    RegisterPage,
    ResetPasswordPage,
    UsersDetailPage,
    PostCreatePage,
    PostDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsersServiceProvider,
    PostServiceProvider,
    CommentProvider,
    LikeProvider
  ]
})
export class AppModule {}
