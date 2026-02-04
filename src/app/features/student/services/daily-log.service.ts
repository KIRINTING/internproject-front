import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';

export interface DailyLog {
    id?: number;
    student_code: string;
    intern_id?: number;
    log_date: string;
    work_description: string;
    hours_worked: number;
    is_weekend: boolean;
    photo_url?: string;
    created_at?: string;
}

export interface HoursSummary {
    weekday_hours: number;
    weekend_hours: number;
    total_hours: number;
    required_weekday_hours: number;
    required_weekend_hours: number;
    required_total_hours: number;
    weekday_percentage: number;
    weekend_percentage: number;
    total_percentage: number;
    total_days_logged: number;
}

@Injectable({
    providedIn: 'root'
})
export class DailyLogService {
    private apiUrl = `${environment.apiUrl}/daily-logs`;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    getLogs(studentCode?: string): Observable<any> {
        const user = this.authService.getCurrentUser();
        const code = studentCode || user?.username;
        if (!code) {
            throw new Error('Student code is required');
        }
        return this.http.get(`${this.apiUrl}?student_code=${code}`);
    }

    createLog(formData: FormData): Observable<any> {
        const user = this.authService.getCurrentUser();
        if (!user || !user.username) {
            throw new Error('User not logged in');
        }
        if (!formData.has('student_code')) {
            formData.append('student_code', user.username);
        }
        return this.http.post(this.apiUrl, formData);
    }

    updateLog(id: number, formData: FormData): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, formData);
    }

    deleteLog(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    getSummary(): Observable<any> {
        const user = this.authService.getCurrentUser();
        if (!user || !user.username) {
            throw new Error('User not logged in');
        }
        return this.http.get(`${this.apiUrl}/summary?student_code=${user.username}`);
    }
}
