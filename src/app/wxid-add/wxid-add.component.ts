import { Component, OnInit } from '@angular/core';
import {ApiService} from '../service/api.service';
import * as XLSX from 'xlsx';
import {DatePipe} from '@angular/common';
import {UtilsService} from "../service/utils.service";
declare let layui:any;

@Component({
  selector: 'app-wxid',
  templateUrl: './wxid-add.component.html',
  styleUrls: ['./wxid-add.component.less']
})
export class WxidAddComponent implements OnInit {

  public userInfo:any = {};

  // import
  inputData: any;
  fileName:any;
  inputDataList = [];
  importResult = [];
  newAdd = [];
  oldData = [];


  constructor(
    private api:ApiService,
    private readonly datePipe: DatePipe,
    private utils: UtilsService
  ) { }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('UserInfo') || '');
    this.createFileUi();
  }

  inputChange() {
    if(!this.inputData)return;
    this.fileName = '';
    this.importResult = this.newAdd = this.oldData = [];
    console.info(this.inputData)
    this.inputDataList = this.inputData.split('\n').filter(item=>item).map((item,index)=>{
      return {wxid: item.trimRight().trimStart(),rowNum:index+1};
    });
  }

  importData() {
    this.api.simRequest('/wxid/add',{list: this.inputDataList}).then( (res:any) =>{
      this.importResult = res;
      this.newAdd = res.filter(item=>!item.IsExist);
      this.oldData = res.filter(item=>item.IsExist);
      this.inputData = '';
      this.inputDataList = [];
    })
  }

  exportExist() {
    let result = [['行号','微信号']];
    this.oldData.forEach(item=>result.push([item.rowNum, item.wxid]));
    this.utils.exportList(result,'exist')
  }

  exportNotExist() {
    let result = [['行号','微信号']];
    this.newAdd.forEach(item=>result.push([item.rowNum, item.wxid]));
    this.utils.exportList(result,'no_exist')
  }


  createFileUi(){
    this.utils.createFileChoose('#file','xlsx|txt').subscribe((res:any)=>{
      console.info('啥情况',res);
      this.inputData = '';
      this.importResult = this.newAdd = this.oldData = [];
      this.fileName = res.fileName;
      this.inputDataList = res.data;
      // this.importData();
    },err=>console.error(err))
  }


}
