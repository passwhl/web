import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../service/api.service';
import {UtilsService} from '../service/utils.service';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
declare let layer: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  public body = {name: '', pwd: ''};

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private utils: UtilsService,
    private router: Router,
    private http: HttpClient
  ) {

  }

  ngOnInit(): void {

  }

  public login(): void {
    const id = layer.load();
    this.api.request('/login', this.body).then(res => {
      layer.close(id);
      this.router.navigateByUrl('/index').then();
    }).catch(err => {
      layer.close(id);
      layer.alert(err.msg, {icon: 5});
    });
  }

  public checkInput(event: any): void {
    event.target.value = event.target.value.replace(/[^\w\.\/]/ig, '');
  }
}
