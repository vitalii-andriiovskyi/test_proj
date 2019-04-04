import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../services/user-service.service';
import { ActivatedRoute, ParamMap, Router, NavigationEnd } from '@angular/router';
import { switchMap, tap, filter, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { RouterHistoryService } from 'src/app/core/services/router-history.service';

@Component({
  selector: 'ntw-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  // user: User = {
  //   id: 1,
  //   first_name: 'George',
  //   last_name: 'Bluth',
  //   avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jp'
  // };
  previousUrl: string;

  user$: Observable<User>;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private routerHistoryService: RouterHistoryService
  ) {
    this.user$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.userService.getUserData(params.get('id')))
      );
  }

  ngOnInit() {
    this.previousUrl = this.routerHistoryService.getPreviousUrl();
  }

}
