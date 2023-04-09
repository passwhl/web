import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from './service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  constructor(
    private router: Router,
    private translate: TranslateService,
    private api: ApiService
  ) {
    this.translate.setDefaultLang('zh_cn');
    this.api.getConfig().then(res => {
      this.translate.use(res.locale);
      document.title = this.translate.instant('title');
    });
    if (localStorage.getItem('UserInfo')){
      this.router.navigateByUrl('index').then();
    }else{
      this.router.navigateByUrl('login').then();
    }
  }



}
