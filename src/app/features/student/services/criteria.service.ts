import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { AuthService } from '../../../auth/auth.service';

export interface InternshipCriteria {
    id?: number;
    student_code: string;
    gpa: number;
    credits_completed: number;
    required_courses_completed: boolean;
    has_advisor_approval: boolean;
    is_eligible: boolean;
    notes?: string;
}

export interface EligibilityCheck {
    is_eligible: boolean;
    details: {
        gpa_pass: boolean;
        credits_pass: boolean;
        courses_pass: boolean;
        advisor_pass: boolean;
    };
    data: InternshipCriteria;
}

@Injectable({
    providedIn: 'root'
})
export class CriteriaService {
    private apiUrl = `${environment.apiUrl}/criteria`;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    getCriteria(): Observable<any> {
        const user = this.authService.getCurrentUser();
        if (!user || !user.username) {
            throw new Error('User not logged in');
        }
        return this.http.get(`${this.apiUrl}/${user.username}`);
    }

    updateCriteria(data: Partial<InternshipCriteria>): Observable<any> {
        const user = this.authService.getCurrentUser();
        if (!user || !user.username) {
            throw new Error('User not logged in');
        }
        return this.http.post(`${this.apiUrl}/${user.username}`, data);
    }

    checkEligibility(): Observable<any> {
        const user = this.authService.getCurrentUser();
        if (!user || !user.username) {
            throw new Error('User not logged in');
        }
        return this.http.get(`${this.apiUrl}/${user.username}/eligibility`);
    }
}
