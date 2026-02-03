import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface Info {
    id?: number;
    info_id: string;
    title: string;
    category: 'Announce' | 'Important' | 'Guide';
    detail: string;
    due_date: string;
    created_at?: string;
    updated_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class InfoService {
    private apiUrl = `${environment.apiUrl}/infos`;

    constructor(private http: HttpClient) { }

    getInfos(): Observable<Info[]> {
        return this.http.get<Info[]>(this.apiUrl);
    }

    getInfo(id: number): Observable<Info> {
        return this.http.get<Info>(`${this.apiUrl}/${id}`);
    }

    createInfo(info: Info): Observable<Info> {
        return this.http.post<Info>(this.apiUrl, info);
    }

    updateInfo(id: number, info: Info): Observable<Info> {
        return this.http.put<Info>(`${this.apiUrl}/${id}`, info);
    }

    deleteInfo(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
