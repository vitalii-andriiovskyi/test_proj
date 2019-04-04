import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { User, UserListData } from '../../models/user.model';
import { Subject, BehaviorSubject, of, merge } from 'rxjs';
import { PageQuery } from 'src/app/models/page-query.model';
import { filter, tap, switchMap, takeUntil, map } from 'rxjs/operators';
import { UserService } from '../services/user-service.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'ntw-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  pageQuery: PageQuery = {
    pageIndex: 1,
    pageSize: 3
  };

  destroy$ = new Subject();
  userListCache: User[] = [];
  private _userListSub$ = new BehaviorSubject(this.userListCache);
  userList$ = this._userListSub$.asObservable();
  userListData: UserListData;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUsers(this.pageQuery);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  ngAfterViewInit() {

    this.paginator.page
      .pipe(
        tap(() => this.changePage()),
        takeUntil(this.destroy$)
      )
      .subscribe();


}

  loadUsers(page: PageQuery) {
    const total: number = (this.userListData && this.userListData.total) || 1;

    const getUsersFromCache$ = of(page).pipe(
      map(this._countEntitiesRequested(total)),
      filter(this._isEntitiesRequested(this.userListCache)),
      // tap(val => console.log('cache case', val)),
      map(() => this.getUsersFromCache(this.userListCache, page)),
      tap(val => this._userListSub$.next(val))
    );

    const getUsersFromServer$ = of(page).pipe(
      map(this._countEntitiesRequested(total)),
      map(this._isEntitiesRequested(this.userListCache)),
      filter(val => !val),
      // tap(val => console.log('server case', val)),
      switchMap(() => {
        return this.userService.getUserList(page.pageIndex);
      }),
      tap(val => {
        this.userListData = val;
        this._userListSub$.next(val.data);
        this.userListCache = this.userListCache.concat(val.data);
      })
    );

    const loadUserList = merge(getUsersFromCache$, getUsersFromServer$).pipe(
      takeUntil(this.destroy$)
    ).subscribe();

  }



  getUsersFromCache(entities: User[], page: PageQuery): User[] {
    const start = (page.pageIndex - 1) * page.pageSize,
          end = start + page.pageSize;

    return entities.slice(start, end);
  }

  changePage() {

    const newPage: PageQuery = {
      pageIndex: this.paginator.pageIndex + 1,
      pageSize: this.paginator.pageSize
    };

    this.loadUsers(newPage);

  }

  private _hasEntitiesInCache(pageQuery: PageQuery, entityList: User[], totalEntities: number): boolean {
    const countEntitiesRequested = (pageQuery.pageIndex + 1) * pageQuery.pageSize;
    const result = Math.min(totalEntities, countEntitiesRequested) <= entityList.length;
    return result;
  }

  private _countEntitiesRequested = (totalEntities: number) => (pageQuery: PageQuery) => {
    const entitiesRequested = (pageQuery.pageIndex + 1) * pageQuery.pageSize;
    return Math.min(totalEntities, entitiesRequested);
  }

  private _isEntitiesRequested = (entityList: User[]) => (entitiesRequestied: number) => entitiesRequestied <= entityList.length;

}
