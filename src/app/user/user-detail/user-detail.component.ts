import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../services/user-service.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

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

  user$: Observable<User>;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.user$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.userService.getUserData(params.get('id')))
      );
    }

  ngOnInit() {
  }

}
