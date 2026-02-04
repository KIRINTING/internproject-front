import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment.development';

export interface Student {
    id?: number;
    student_code: string;
    name_th: string;
    name_en: string;
    faculty: string;
    major: string;
    email: string;
    phone: string;
    address: string;
    gpa: number;
    cumulative_credits?: number;
}

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    private apiUrl = `${environment.apiUrl}/students`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    // Get current student profile by student code
    getProfile(): Observable<any> {
        const user = this.authService.getCurrentUser();
        if (!user || !user.username) {
            throw new Error('User not logged in');
        }

        return this.http.get(`${this.apiUrl}/code/${user.username}`, {
            params: { student_code: user.username }
        });
    }

    // Update student profile
    updateProfile(data: Student): Observable<any> {
        if (!data.id) {
            throw new Error('Student ID is required for update');
        }

        return this.http.put(`${this.apiUrl}/${data.id}`, data);
    }
}
