import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserPreviewComponent } from './user-preview/user-preview.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

@NgModule({
  declarations: [UserPreviewComponent, UserListComponent, UserDetailComponent],
  imports: [
    SharedModule,
    UserRoutingModule
  ]
})
export class UserModule { }
