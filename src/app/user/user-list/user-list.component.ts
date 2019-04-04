import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, UserListData } from '../../models/user.model';
import { Subject, BehaviorSubject, of, merge } from 'rxjs';
import { PageQuery } from 'src/app/models/page-query.model';
import { filter, tap, switchMap, takeUntil } from 'rxjs/operators';
import { UserService } from '../services/user-service.service';

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

  pageQuery: PageQuery = {
    pageIndex: 1,
    pageSize: 3
  };

  destroy$ = new Subject();
  userList: User[] = [];
  private _userListSub$ = new BehaviorSubject(this.userList);
  userList$ = this._userListSub$.asObservable();
  userListData: UserListData;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUsers(this.pageQuery);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  loadUsers(page: PageQuery) {
    const userList = this.getUserFromCache(page);
    const getUsersFromCache$ = of(userList).pipe(
      tap(val => console.log(val)),
      filter(val => userList.length === page.pageSize ||
                    (this.userListData && this.userListData.total_pages === page.pageIndex)),
      tap(val => this._userListSub$.next(val))
    );

    const getUsersFromServer$ = of(userList).pipe(
      tap(val => console.log('server', val)),
      filter(val => userList.length === 0 || !this.userListData || !this.userListData.total_pages ||
                    (this.userListData.total_pages && this.userListData.total_pages === page.pageIndex)),
      switchMap(val => {
        return this.userService.getUserList(page.pageIndex);
      }),
      tap(val => this._userListSub$.next(val.data))
    );

    const loadUserList = merge(getUsersFromCache$, getUsersFromServer$).pipe(
      takeUntil(this.destroy$)
    ).subscribe();

  }

  getUserFromCache(page: PageQuery) {
    const start = page.pageIndex * page.pageSize,
          end = start + page.pageSize;

    return this.userList.slice(start, end);
  }

}
