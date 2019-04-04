import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/user.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'ntw-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  user: User = {
    id: 1,
    first_name: 'George',
    last_name: 'Bluth',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jp'
  };

  destroy$ = new Subject();
  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
