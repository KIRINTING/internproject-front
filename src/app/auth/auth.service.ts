import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

export interface User {
  id: string | number;
  username: string; // student_code or officer username
  role: 'student' | 'officer' | 'mentor' | 'supervisor';
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient) { }

  login(username: string, password: string, role?: 'student' | 'officer' | 'mentor' | 'supervisor'): Observable<boolean> {
    const payload = { username, password };

    return this.http.post<any>(`${this.apiUrl}/login`, payload).pipe(
      tap(response => {
        if (response.access_token && response.user) {
          const detectedRole = response.role;
          const user: User = {
            id: response.user.id,
            username: detectedRole === 'student' ? response.user.student_id : response.user.username,
            role: detectedRole,
            name: detectedRole === 'student'
              ? (response.user.name_th || response.user.name || `${response.user.first_name || ''} ${response.user.last_name || ''}`.trim())
              : (response.user.name || response.user.officer_code)
          };
          this.setSession(user, response.access_token);
        }
      }),
      map(() => true)
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setSession(user: User, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
