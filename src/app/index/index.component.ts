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

  constructor(
    private api: ApiService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('UserInfo') || '');
    console.info('当前用户', this.userInfo);
  }

  loginOut(): void {
    this.api.logout();
  }
}
