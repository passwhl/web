import { Component, OnInit } from '@angular/core';
import {ApiService} from '../service/api.service';
import * as XLSX from 'xlsx';
import {DatePipe} from '@angular/common';
import {UtilsService} from "../service/utils.service";
declare let layui:any;

@Component({
  selector: 'app-wxid',
  templateUrl: './wxid.component.html',
  styleUrls: ['./wxid.component.less']
})
export class WxidComponent implements OnInit {

  public userInfo:any = {};

  // list
  public key = '';
  public startTime;
  public endTime;
  public result = {pageNum: 0, pageSize: 10, total: 0, list: []};

  constructor(
    private api:ApiService,
    private readonly datePipe: DatePipe,
    private utils: UtilsService
  ) { }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('UserInfo') || '');
    this.getList(this.key,1,this.result.pageSize)
  }

  deleteWxid(item: any, i: number) {
    this.api.simRequest('/wxid/delete', {id: item.id}).then(res => {
      this.result.list.splice(i);
      this.getList(this.key,this.result.pageNum,this.result.pageSize)
    })
  }

  getList(key,pageNum, pageSize) {
    let startTime = this.startTime;
    let endTime = this.endTime;
    this.api.simRequest('/wxid/list', {pageNum, pageSize, key,startTime,endTime}).then((res: any) => {
      this.updatePage(res);
      this.result = res;
    })
  }

  search() {
    this.getList(this.key,1,this.result.pageSize)
  }

  updatePage(result) {
    layui.laypage.render({
      elem: 'page',          //注意，这里的 test1 是 ID，不用加 # 号
      count: result.total,         //数据总数，从服务端得到
      limit: result.pageSize,            //每页条数
      limits: [10, 50, 100],  //每页条数选项
      layout: ['count', 'prev', 'page', 'next', 'limit'],
      curr: result.pageNum,  //当前页数，从服务端得到
      jump: (obj: any, first: any) => first ? null : this.getList(this.key,obj.curr, obj.limit)
    });
  }

  initDateTime(){
    this.startTime = this.datePipe.transform(new Date(),'yyyy-MM-dd') ;
    this.endTime = this.datePipe.transform(new Date(),'yyyy-MM-dd');
    layui.laydate.render({
      elem: '#start',range:true,
      value:this.startTime+" - "+this.endTime,
      done: (value)=>{
        this.startTime = value.split(" - ")[0];
        this.endTime = value.split(" - ")[1];
      }
    });
  }

  exportList() {
    let result = [['行号','微信号','导入人','导入时间']];
    this.result.list.forEach((item,index)=>{
      result.push([index+1, item.wxId,item.user,this.datePipe.transform(item.dateTime,'yyyy-MM-dd HH:mm:ss')])
    });
    this.utils.exportList(result,'search_result')
  }

  exportAllList() {
    let result = [['行号','微信号','导入人','导入时间']];
    this.api.simRequest('/wxid/list', {pageNum:1, pageSize:this.result.total,key:this.key}).then((res: any) => {
      res.list.forEach((item,index)=>{
        result.push([index+1, item.wxId,item.user,this.datePipe.transform(item.dateTime,'yyyy-MM-dd HH:mm:ss')])
      });
      this.utils.exportList(result,'search_result')
    })
  }
}
