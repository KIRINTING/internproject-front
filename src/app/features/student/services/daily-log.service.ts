import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface DailyLog {
    id?: number;
    student_id: string;
    date: string;
    work_details: string;
    image_path?: string;
    created_at?: string;
    updated_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DailyLogService {
    private apiUrl = `${environment.apiUrl}/daily_logs`;

    constructor(private http: HttpClient) { }

    getLogs(studentId: string): Observable<DailyLog[]> {
        return this.http.get<DailyLog[]>(`${this.apiUrl}?student_id=${studentId}`);
    }

    createLog(data: FormData): Observable<DailyLog> {
        return this.http.post<DailyLog>(this.apiUrl, data);
    }

    updateLog(id: number, data: FormData): Observable<DailyLog> {
        // Use _method: PUT for Laravel file uploads via POST if needed, or just POST with method spoofing
        // However, for FormData updates with files, standard POST with _method=PUT is safer in Laravel
        data.append('_method', 'PUT');
        return this.http.post<DailyLog>(`${this.apiUrl}/${id}`, data);
    }

    deleteLog(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
