import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, LoginRequest, LoginResponse, RegisterRequest, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenKey = 'auth_token';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    console.log('===== AuthService Initialization =====');
    console.log('1. isBrowser:', this.isBrowser);
    
    const storedUser = this.isBrowser ? localStorage.getItem('current_user') : null;
    const storedToken = this.isBrowser ? localStorage.getItem(this.tokenKey) : null;
    console.log('2. Stored user string:', storedUser);
    console.log('3. Stored token:', storedToken);
    
    let parsedUser = null;
    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);
        console.log('4. Parsed user object:', parsedUser);
      } catch (e) {
        console.error('4. Error parsing stored user:', e);
      }
    } else {
      console.log('4. No stored user found');
    }
    
    this.currentUserSubject = new BehaviorSubject<User | null>(parsedUser);
    this.currentUser = this.currentUserSubject.asObservable();
    console.log('5. Current user value after init:', this.currentUserSubject.value);
    console.log('6. Is authenticated:', this.isAuthenticated());
    console.log('======================================');
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    return this.isBrowser ? localStorage.getItem(this.tokenKey) : null;
  }

  public get isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  public get isLearner(): boolean {
    return this.currentUserValue?.role === 'learner';
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${environment.apiUrl}/auth/login`,
      credentials
    ).pipe(
      tap(response => {
        if (response.success && response.data && this.isBrowser) {
          localStorage.setItem(this.tokenKey, response.data.token);
          localStorage.setItem('current_user', JSON.stringify(response.data.user));
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<ApiResponse<{ user: User }>> {
    return this.http.post<ApiResponse<{ user: User }>>(
      `${environment.apiUrl}/auth/register`,
      data
    );
  }

  logout(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${environment.apiUrl}/auth/logout`,
      {}
    ).pipe(
      tap(() => {
        this.clearAuth();
      })
    );
  }

  me(): Observable<ApiResponse<{ user: User }>> {
    return this.http.get<ApiResponse<{ user: User }>>(
      `${environment.apiUrl}/auth/me`
    );
  }

  clearAuth(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('current_user');
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const result = !!this.token && !!this.currentUserValue;
    console.log('isAuthenticated check:', {
      hasToken: !!this.token,
      hasUser: !!this.currentUserValue,
      result: result
    });
    return result;
  }
}
