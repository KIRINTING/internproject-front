import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Student {
    id: number;
    student_code: string;
    name_th: string;
    name_en: string;
    major: string;
    password_expires_at: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class OfficerStudentService {
    private apiUrl = `${environment.apiUrl}/officer/students`;

    constructor(private http: HttpClient) { }

    getStudents(params?: any): Observable<any> {
        return this.http.get<any>(this.apiUrl, { params });
    }

    updatePasswordExpiry(id: number, expiryDate: string | null): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/password-expiry`, {
            password_expires_at: expiryDate
        });
    }
}
