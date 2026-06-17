import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
    const router = inject(Router);
    const user = localStorage.getItem('user');

    if (user) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};

export const publicGuard = () => {
    const router = inject(Router);
    const user = localStorage.getItem('user');

    if (user) {
        router.navigate(['/dashboard']);
        return false;
    }

    return true;
};