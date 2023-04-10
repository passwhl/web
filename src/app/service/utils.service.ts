import {Injectable} from '@angular/core';
import * as XLSX from 'xlsx';
import {Subject} from "rxjs";
declare let layui:any;

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() {
  }


  exportList(list:Array<Array<any>>,fileName='data') {
    let id = layui.layer.load();
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(list);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    console.info(ws)
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    let newName = fileName+".xlsx";
    XLSX.writeFile(wb, newName);
    layui.layer.close(id);
  }

  createFileChoose(id,exts){
    let sub = new Subject();
    let thisSer = this;
    let uploadRender = layui.upload.render({elem: id, exts:exts, auto:false, choose:function(obj:any){
      console.info(obj)
      let id = layui.layer.load();
      obj.preview((index:number, file:Blob | any, result:any)=>{
        console.info(file)
        if(file.name.endsWith('txt')!=-1 || file.name.endsWith('log')!=-1){
          thisSer.readTextFile(file).then(data=>{
            sub.next({fileName:file.name,data});
          }).catch(err=>sub.error(err))
        }else if(file.name.endsWith('xlsx')!=-1){
          thisSer.readXlsxFile(file).then(data=>{
            sub.next({fileName:file.name,data});
          }).catch(err=>sub.error(err))
        }
        // else{
        //   sub.next(file)
        // }
        layui.layer.close(id);
        uploadRender.config.elem.next()[0].value = '';
      });
    }})
    return sub;
  }

  readTextFile(file,encoding='utf-8'){
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = e =>{
        let list = e.target.result.toString().split('\r\n').map((item,index)=>{
          return {wxid: item,rowNum:index+1};
        });
        resolve(list)
      };
      reader.onerror = err=>reject(err);
      reader.readAsText(file,encoding)
    })
  }

  readXlsxFile(file){
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const wb: XLSX.WorkBook = XLSX.read(e.target.result, {type: 'binary'});
        const ws: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[0]];
        let list = XLSX.utils.sheet_to_json(ws,{header:["wxid"]}).map((item:any,index)=>{
          return {wxid: item.wxid,rowNum:index+1};
        });
        resolve(list);
      };
      reader.onerror = e=>reject(e);
      reader.readAsBinaryString(file);
    })
  }



}
