import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface Company {
    id: number;
    company_id: string;
    name: string;
    position: string;
    location: string;
    address_details?: string;
    tel: string;
    email?: string;
    student_vacancy: number;
    latitude?: number;
    longitude?: number;
    created_at?: string;
    updated_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private apiUrl = `${environment.apiUrl}/companies`;

    constructor(private http: HttpClient) { }

    getCompanies(): Observable<Company[]> {
        return this.http.get<Company[]>(this.apiUrl);
    }

    getCompany(id: number): Observable<Company> {
        return this.http.get<Company>(`${this.apiUrl}/${id}`);
    }
}
