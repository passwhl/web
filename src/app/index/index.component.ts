import { Component, OnInit } from '@angular/core';
import {ApiService} from '../service/api.service';
import {NavigationEnd, Router} from '@angular/router';
import {Observable} from "rxjs";
import {filter} from "rxjs/operators";
declare let layui: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

  public userInfo: any = {};
  public navIndex = 1;

  constructor(
    private api: ApiService,
    private router: Router
  ) {
    (this.router.events.pipe(filter(event => event instanceof NavigationEnd)) as Observable<NavigationEnd>).subscribe(router => {
      // console.info('路由变更',router)
      if(router.urlAfterRedirects == '/index/wxid')this.navIndex=1;
      else if(router.urlAfterRedirects == '/index/wxid-list')this.navIndex=2;
      else if(router.urlAfterRedirects == '/index/user')this.navIndex=3;
      else if(router.urlAfterRedirects.startsWith('/index/change-pwd'))this.navIndex=4;
      else this.navIndex=1;
    });
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('UserInfo') || '');
    console.info('当前用户', this.userInfo);
  }

  loginOut(): void {
    this.api.logout();
  }
}
