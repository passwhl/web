import {Component, OnInit} from '@angular/core';
import {ApiService} from '../service/api.service';
import * as XLSX from 'xlsx';
import {DatePipe} from '@angular/common';
import {Router} from "@angular/router";

declare let layui: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

  public userInfo: any = {};
  public user = {name: '', pwd: ''};
  public result = {pageNum: 0, pageSize: 10, total: 0, list: []};

  constructor(
    private router: Router,
    private api: ApiService,
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('UserInfo') || '');
    this.getList(1, this.result.pageSize);
  }

  getList(pageNum, pageSize) {
    this.api.simRequest('/user/list', {pageNum, pageSize}).then((res: any) => {
      this.updatePage(res);
      this.result = res;
    })
  }

  addUser() {
    this.api.simRequest('/user/add', this.user).then(res => {
      this.user.name = this.user.pwd = '';
      this.getList(1,this.result.pageSize)
      document.getElementById('name').focus();
    })
  }

  deleteUser(user, i: number) {
    this.api.simRequest('/user/delete', {uid: user.uid}).then(res => {
      this.result.list.splice(i);
      this.getList(this.result.pageNum,this.result.pageSize)
    })
  }

  updatePage(result) {
    layui.laypage.render({
      elem: 'page',          //注意，这里的 test1 是 ID，不用加 # 号
      count: result.total,         //数据总数，从服务端得到
      limit: result.pageSize,            //每页条数
      limits: [10, 50, 100],  //每页条数选项
      layout: ['count', 'prev', 'page', 'next', 'limit'],
      curr: result.pageNum,  //当前页数，从服务端得到
      jump: (obj: any, first: any) => first ? null : this.getList(obj.curr, obj.limit)
    });
  }

  changePwd(user: any, i: number) {
    this.router.navigate(['/index/change-pwd',user]).then();
  }
}
