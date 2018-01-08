import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostCreatePage } from './post-create';

@NgModule({
  declarations: [
    PostCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(PostCreatePage),
  ],
})
export class PostCreatePageModule {}
