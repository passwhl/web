import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {IndexComponent} from './index/index.component';
import {WxidComponent} from "./wxid/wxid.component";
import {UserComponent} from "./user/user.component";
import {WxidAddComponent} from "./wxid-add/wxid-add.component";
import {ChangePwdComponent} from "./change-pwd/change-pwd.component";

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'index', component: IndexComponent, children: [
      {path: '', redirectTo: 'wxid', pathMatch: 'full'},
      {path: 'wxid', component: WxidAddComponent},
      {path: 'wxid-list', component: WxidComponent},
      {path: 'user', component: UserComponent},
      {path: 'change-pwd', component: ChangePwdComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
