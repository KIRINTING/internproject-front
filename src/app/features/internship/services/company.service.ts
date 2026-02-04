import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface Company {
    id?: number;
    company_id: string;
    name: string;
    position: string; // Used as 'Type' in frontend
    location: string;
    address_details?: string;
    tel: string;
    student_vacancy: number;
    rating?: number; // Optional as it might not be in DB yet or calculated separately
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

    createCompany(company: Company): Observable<Company> {
        return this.http.post<Company>(this.apiUrl, company);
    }

    updateCompany(id: number, company: Company): Observable<Company> {
        return this.http.put<Company>(`${this.apiUrl}/${id}`, company);
    }

    deleteCompany(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
