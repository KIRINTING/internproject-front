import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TrainingEvidenceData {
    total_training_hours: number;
    absence_days: number;
    leave_days: number;
    start_date?: Date | string;
    end_date?: Date | string;
}

export interface TrainingEvidenceResponse {
    success: boolean;
    message?: string;
    data: {
        intern?: any;
        total_training_hours: number;
        absence_days: number;
        leave_days: number;
        calculated_hours: number;
        training_status: 'pending' | 'passed' | 'failed';
        start_date?: string;
        end_date?: string;
        evidence_submitted_at?: string;
        calculation: {
            absence_hours: number;
            leave_hours: number;
            required_hours: number;
            total_required_hours: number;
            percentage: number;
        };
    };
}

@Injectable({
    providedIn: 'root'
})
export class TrainingEvidenceService {
    private apiUrl = 'http://localhost:8000/api/interns';

    constructor(private http: HttpClient) { }

    submitTrainingEvidence(internId: number, data: TrainingEvidenceData): Observable<TrainingEvidenceResponse> {
        return this.http.post<TrainingEvidenceResponse>(
            `${this.apiUrl}/${internId}/training-evidence`,
            data
        );
    }

    getTrainingEvidence(internId: number): Observable<TrainingEvidenceResponse> {
        return this.http.get<TrainingEvidenceResponse>(
            `${this.apiUrl}/${internId}/training-evidence`
        );
    }
}
