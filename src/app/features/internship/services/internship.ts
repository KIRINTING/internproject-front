import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface InternshipRequest {
  id?: number;
  intern_id: string;
  // Student Information
  student_code: string;
  title: string;
  first_name: string;
  last_name: string;
  phone: string;
  class_group: string;
  registration_status: string;
  // Company Information
  company_name: string;
  position: string;
  job_description: string;
  company_address: string;
  company_phone: string;
  // Coordinator Information
  coordinator_name: string;
  coordinator_position: string;
  coordinator_phone: string;
  // Approver Information
  approver_name: string;
  approver_position: string;
  // Location & Photo
  google_map_coordinates?: string;
  photo_path?: string;
  // Additional
  notes?: string;
  created_at?: string;

  // Approval Status
  status?: 'pending' | 'officer_approved' | 'dean_approved' | 'rejected';
  pdf_path?: string;
  rejection_reason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InternshipService {
  private apiUrl = `${environment.apiUrl}/interns`;

  constructor(private http: HttpClient) { }

  submitRequest(formData: FormData): Observable<InternshipRequest> {
    return this.http.post<InternshipRequest>(this.apiUrl, formData);
  }

  getRequests(): Observable<InternshipRequest[]> {
    return this.http.get<InternshipRequest[]>(this.apiUrl);
  }

  getRequest(id: number): Observable<InternshipRequest> {
    return this.http.get<InternshipRequest>(`${this.apiUrl}/${id}`);
  }

  updateRequest(id: number, formData: FormData): Observable<InternshipRequest> {
    return this.http.post<InternshipRequest>(`${this.apiUrl}/${id}?_method=PUT`, formData);
  }

  deleteRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Approval Workflow Methods
  approveByOfficer(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve-officer`, {});
  }

  rejectRequest(id: number, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reject`, { reason });
  }

  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download-pdf`, { responseType: 'blob' });
  }

  // Get student's own internship request by student code
  getMyInternship(studentCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/${studentCode}`);
  }

  // Get internship status (convenience method)
  getInternshipStatus(id: number): Observable<InternshipRequest> {
    return this.getRequest(id);
  }
}
