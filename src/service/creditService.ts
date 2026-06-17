import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CreditService {

    private apiUrl = 'http://localhost:8080/api/credits';

    constructor(private http: HttpClient) { }

    getBalance(email: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/balance?email=${email}`);
    }
}