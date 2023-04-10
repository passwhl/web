import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ApiService} from '../service/api.service';
import {ActivatedRoute} from '@angular/router';
import {Location as Location1} from '@angular/common';
declare let layer: any;

@Component({
  selector: 'app-login',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.less']
})
export class ChangePwdComponent {

  public userInfo: any;
  public body = {uid: '', pwd: '', rpwd: ''};

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private location: Location1
  ) {
    const routeParams = this.activatedRoute.snapshot.paramMap;
    this.userInfo = routeParams['params'];
    if(routeParams.keys.length==0) this.userInfo = JSON.parse(localStorage.getItem('UserInfo') || '');
    console.info(this.userInfo)
  }

  public checkInput(event: any): void {
    event.target.value = event.target.value.replace(/[^\w\.\/]/ig, '');
  }

  changePwd(message?: any) {
    if(!this.body.pwd) return layer.alert('请输入密码', {icon: 5});
    if(!this.body.rpwd) return layer.alert('请再次输入密码', {icon: 5});
    if(this.body.pwd!=this.body.rpwd) return layer.alert('两次输入不一致', {icon: 5});
    if(this.userInfo)this.body.uid = this.userInfo.uid;
    this.api.simRequest('/user/changePwd', this.body).then(res => {
      layer.alert('修改成功',(index)=>{
        this.location.back();
        layer.close(index);
      },{icon: 1})
    })
  }
}
