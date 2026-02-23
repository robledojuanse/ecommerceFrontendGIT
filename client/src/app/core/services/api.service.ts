import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
    errors?: any[];
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private http = inject(HttpClient);
    // Ideally this comes from an environment file
    private readonly baseUrl = 'http://localhost:3000/api';

    get<T>(path: string, params?: any): Observable<ApiResponse<T>> {
        return this.http.get<ApiResponse<T>>(`${this.baseUrl}${path}`, { params });
    }

    post<T>(path: string, body: any): Observable<ApiResponse<T>> {
        return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
    }
}
