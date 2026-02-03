import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OfficerService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // ... existing methods (I'll just add this new one)

    getReports(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/officer/reports`);
    }
}
