import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface MonitorSummary {
    id: number;
    student_code: string;
    full_name: string;
    company_name: string;
    total_hours: number;
    required_hours: number;
    progress_percent: number;
    status: string;
}

export interface MonitorDetail {
    intern: {
        id: number;
        student_code: string;
        full_name: string;
        company_name: string;
        position: string;
        start_date: string;
        end_date: string;
    };
    hours: {
        weekday: number;
        weekend: number;
        total: number;
        days_worked: number;
        days_absence: number;
        days_leave: number;
    };
    photos: {
        id: number;
        url: string;
        date: string;
        description: string;
    }[];
    logs: {
        id: number;
        date: string;
        hours: number;
        desc: string;
        is_weekend: boolean;
        photo: string | null;
    }[];
}

@Injectable({
    providedIn: 'root'
})
export class MonitorService {
    private apiUrl = `${environment.apiUrl}/officer/monitor`;

    constructor(private http: HttpClient) { }

    getMonitorList(): Observable<MonitorSummary[]> {
        return this.http.get<MonitorSummary[]>(this.apiUrl);
    }

    getMonitorDetail(id: number): Observable<MonitorDetail> {
        return this.http.get<MonitorDetail>(`${this.apiUrl}/${id}`);
    }
}
