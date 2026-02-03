import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Assessment {
    id?: number;
    student_id: string;
    evaluator_id: string;
    evaluator_type: 'mentor' | 'supervisor';
    scores: any;
    comments: string;
    evaluation_date: string;
}

@Injectable({
    providedIn: 'root'
})
export class SupervisorService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getMyStudents(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/supervisor/students`);
    }

    submitAssessment(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/assessments`, data);
    }

    getAssessments(studentId: string): Observable<Assessment[]> {
        return this.http.get<Assessment[]>(`${this.apiUrl}/assessments?student_id=${studentId}&evaluator_type=supervisor`);
    }
}
