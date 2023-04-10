import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {timeout} from 'rxjs/operators';
import { Base64 } from 'js-base64';
import {Subject} from "rxjs";
declare let layui:any;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public config: any = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

  }

  async getConfig(): Promise<any>{
    if (this.config) {return this.config; }
    const res: any = await this.http.get('assets/service.json').toPromise();
    this.config = res;
    if (!this.config) {throw {error: '请配置assets/service.json'}; }
    if (!this.config.service_host) {throw {error: '请配置assets/service.json中的service_host'}; }
    return this.config;
  }

  simRequest(api: string, body: any){
    let subject = new Subject();
    let id = layui.layer.load();
    this.request(api, body).then(res=>{
      console.info(res);
      layui.layer.close(id);
      subject.next(res);
      subject.complete();
    }).catch(err=>{
      console.error('simRequest',err)
      layui.layer.close(id);
      layui.layer.alert(err.msg, {icon: 5});
    })
    return subject.toPromise();
  }

  request(api: string, body: any): any{
    if (body && this.config) { body['locale'] = this.config.locale; }
    let head = new HttpHeaders();
    head = head.set('content-type', 'application/json;charset=utf-8');
    const token = localStorage.getItem('AccessToken');
    if (token) {head = head.set('AccessToken', token); }
    return this.post(api, body, {headers: head, observe: 'response'});
  }


  uploadFile(api: string, form: FormData): any{
    let head = new HttpHeaders();
    head = head.set('content-type', 'multipart/form-data');
    const token = localStorage.getItem('AccessToken');
    if (token) {head = head.set('AccessToken', token); }
    return this.post(api, form, {headers: head, observe: 'response'});
  }


  refreshToken(api, body, option): any{
    let head = new HttpHeaders();
    head = head.set('content-type', 'application/json;charset=utf-8');
    const token = localStorage.getItem('AccessToken');
    if (token) {head = head.set('AccessToken', token); }
    const refreshToken = localStorage.getItem('RefreshToken');
    if (refreshToken) {head = head.set('RefreshToken', refreshToken); }
    return this.post('/refreshToken', {}, {headers: head, observe: 'response'})
      .then(() => this.request(api, body))
      .catch(err => this.handError(err, api, body, option));
  }



  async post(api: string, body: any, option: any): Promise<any> {
    try{
      const url = (await this.getConfig()).service_host + api;
      console.info('发起请求', url, body, option);
      const res: any = await this.http.post(url, body, option).pipe(timeout(6000)).toPromise();
      console.info('请求成功', url, body, option);
      return this.saveToken(res);
    }catch (e) {
      console.info('请求失败', e);
      return this.handError(e, api, body, option);
    }
  }


  saveToken(res): any{
    if (res.status !== 200 && !res.headers.get('RefreshToken')) {return res; }
    const accessToken = res.headers.get('AccessToken');
    const refreshToken = res.headers.get('RefreshToken');
    if( !accessToken || !refreshToken) return res.body;
    const userInfo = Base64.decode(accessToken.split('.')[1]);
    localStorage.setItem('AccessToken', accessToken);
    localStorage.setItem('RefreshToken', refreshToken);
    localStorage.setItem('UserInfo', userInfo);
    console.info(accessToken, refreshToken, userInfo);
    return res.body;
  }


  handError(err, api: string, body: any, option: any): any{
    if (err.status === 402) {return this.refreshToken(api, body, option); }
    if (err.status === 401) {this.logout(); }
    if (err.status === 401) {throw {msg: "请重新登录"}; }
    if (err.status === 0) {throw {msg: "网络请求失败"}; }
    if (err.status === 500){throw {msg: err.error}; }
    throw {msg: JSON.stringify(err)};
  }


  logout(): any{
    localStorage.removeItem('UserInfo');
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('RefreshToken');
    this.router.navigateByUrl('/login').then();
  }


}
