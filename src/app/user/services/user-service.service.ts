import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { User, UserListData } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUrl = `https://reqres.in/api/users/`;
  userListUrl = 'https://reqres.in/api/users';
  userFallback: User = {
    id: 1,
    first_name: 'No name',
    last_name: 'No last name',
    avatar: ''
  };

  constructor(private http: HttpClient) { }

  getUserData(id: string): Observable<User> {
    return this.http.get<User>(`${this.userUrl}${id}`).pipe(
      shareReplay(), // to avoid extra calls to the same endpoint
      catchError(this.handleError(this.userFallback))
    );
  }

  getUserList(page: number): Observable<UserListData> {
    return this.http.get<UserListData>(`${this.userListUrl}`, {
      params: new HttpParams()
          .set('page', page.toString())
  }).pipe(
      shareReplay(), // to avoid extra calls to the same endpoint
      catchError(this.handleError({}))
    );
  }

  handleError = (data: any) => (err: any) => {
    console.warn(err); // there must be custom logger
    return of(data);
  }
}
