import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
    providedIn: 'root'
})
export class CreditService {
    private apiUrl = `${environment.apiUrl}`;
    private url = this.apiUrl + '/api/credits';

    constructor(private http: HttpClient) { }

    getBalance(email: string): Observable<any> {
        return this.http.get(`${this.url}/balance?email=${email}`);
    }
}