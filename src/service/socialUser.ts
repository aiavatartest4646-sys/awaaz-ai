// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SocialUser {
    id: string;
    email: string;
    name: string;
    photoUrl: string;
    authToken: string;
    provider: string;
    providerId: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth';

    constructor(private http: HttpClient) { }

    socialLogin(userData: any, provider: string): Observable<any> {
        const payload = {
            provider: provider,
            authToken: userData.authToken,
            email: userData.email,
            name: userData.name,
            providerId: userData.id,
            photoUrl: userData.photoUrl
        };

        return this.http.post(`${this.apiUrl}/social-login`, payload);
    }
}