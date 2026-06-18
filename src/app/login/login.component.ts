import { Component, OnInit, OnDestroy, inject, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SocialAuthService, SocialUser, MicrosoftLoginProvider, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    GoogleSigninButtonModule  // ✅ This resolves the error
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  // Services
  private socialAuthService = inject(SocialAuthService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // User data
  user: SocialUser | null = null;
  loggedIn: boolean = false;

  // UI States
  loading: boolean = false;
  showPasswordLogin: boolean = false;
  rememberMe: boolean = false;
  showPassword: boolean = false;

  // Messages
  errorMessage: string = '';
  successMessage: string = '';

  // Forms
  loginForm: FormGroup;

  private url = `${environment.apiUrl}`;
  // API URL
  private apiUrl = this.url + '/api/auth';

  // Countdown for auto-hide messages
  private messageTimeout: any;

  constructor() {
    // Initialize login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Subscribe to social auth state (catches BOTH Google and Microsoft logins)
    this.socialAuthService.authState.subscribe({
      next: (user) => {
        if (user) {
          console.log('Social user received:', user);
          this.user = user;
          this.loggedIn = true;
          this.handleSocialLogin(user);
        }
      },
      error: (error) => {
        console.error('Social auth error:', error);
        this.showError('Authentication failed. Please try again.');
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // Check if Google library is loaded
    setTimeout(() => {
      this.checkGoogleLibrary();
    }, 1000);
  }

  private checkGoogleLibrary(): void {
    if (typeof (window as any).google !== 'undefined') {
      console.log('✅ Google library loaded successfully');
    } else {
      console.warn('⚠️ Google library not loaded - check internet connection');
    }
  }

  ngOnDestroy(): void {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
  }

  // ========== MICROSOFT LOGIN METHOD ==========
  // NOTE: Google login is handled automatically by the asl-google-signin-button directive!
  // No need for signInWithGoogle() method

  signInWithMicrosoft(): void {
    console.log('Starting Microsoft sign in...');
    this.loading = true;
    this.clearMessages();

    try {
      this.socialAuthService.signIn(MicrosoftLoginProvider.PROVIDER_ID)
        .then((user) => {
          console.log('✅ Microsoft sign in successful:', user);
          // The authState subscription will handle the rest
        })
        .catch(error => {
          console.error('❌ Microsoft sign in error:', error);

          if (error?.message?.includes('popup')) {
            this.showError('Popup blocked! Please allow popups for this site and try again.');
          } else {
            this.showError('Microsoft sign in failed. Please try again.');
          }
          this.loading = false;
        });
    } catch (error: any) {
      console.error('❌ Exception during Microsoft sign in:', error);
      this.showError('Failed to initialize Microsoft sign in');
      this.loading = false;
    }
  }

  // ========== HANDLE BACKEND AUTHENTICATION ==========

  private handleSocialLogin(user: SocialUser): void {
    // Determine the correct provider
    let provider = '';
    if (user.provider === 'GOOGLE') {
      provider = 'GOOGLE';
    } else if (user.provider === 'MICROSOFT') {
      provider = 'MICROSOFT';
    } else {
      provider = user.provider || 'UNKNOWN';
    }

    console.log(`📝 Processing login for provider: ${provider}`);
    console.log('👤 User data:', user);

    // Use idToken for Google, authToken for Microsoft
    const token = user.idToken || user.authToken;
    if (!token) {
      console.error('❌ No token received from social login');
      this.showError('Authentication failed: No token received');
      this.loading = false;
      return;
    }

    const payload = {
      provider: provider,
      authToken: token,
      email: user.email,
      name: user.name,
      providerId: user.id,
      photoUrl: user.photoUrl
    };

    console.log('📤 Sending to backend:', { ...payload, authToken: '***HIDDEN***' });

    this.http.post(`${this.apiUrl}/social-login`, payload)
      .subscribe({
        next: (response: any) => {
          console.log('✅ Backend response:', response);
          this.loading = false;

          if (response.success) {
            // Store user data
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('authToken', token);

            this.showSuccess(`Welcome ${response.user.name || user.name}! Login successful.`);

            // Navigate after short delay
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1500);
          } else {
            this.showError(response.message || 'Login failed. Please try again.');
            this.socialAuthService.signOut();
            this.loggedIn = false;
            this.user = null;
          }
        },
        error: (error) => {
          console.error('❌ Backend error:', error);
          this.loading = false;

          if (error.status === 0) {
            this.showError('Cannot connect to server. Please make sure the backend is running on por');
          } else if (error.status === 401) {
            this.showError('Authentication failed. Please try again.');
          } else {
            this.showError(error.error?.message || 'Failed to authenticate with server. Please try again.');
          }

          // Sign out from social auth if backend fails
          this.socialAuthService.signOut();
          this.loggedIn = false;
          this.user = null;
        }
      });
  }

  // ========== TRADITIONAL LOGIN (Optional) ==========

  onTraditionalLogin(): void {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      this.showError('Please fill in all required fields correctly.');
      return;
    }

    this.loading = true;
    this.clearMessages();

    const credentials = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
      rememberMe: this.loginForm.get('rememberMe')?.value
    };

    this.http.post(`${this.apiUrl}/login`, credentials)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.success) {
            localStorage.setItem('user', JSON.stringify(response.user));
            if (credentials.rememberMe) {
              localStorage.setItem('rememberMe', 'true');
            }
            this.showSuccess('Login successful! Redirecting...');
            setTimeout(() => this.router.navigate(['/dashboard']), 1500);
          } else {
            this.showError(response.message || 'Invalid credentials');
          }
        },
        error: (error) => {
          this.loading = false;
          this.showError(error.error?.message || 'Login failed. Please check your credentials.');
        }
      });
  }

  // ========== UI HELPER METHODS ==========

  toggleLoginMode(): void {
    this.showPasswordLogin = !this.showPasswordLogin;
    this.clearMessages();
    this.loginForm.reset();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.messageTimeout = setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.messageTimeout = setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  // ========== VALIDATION HELPERS ==========

  get emailControl() { return this.loginForm.get('email'); }
  get passwordControl() { return this.loginForm.get('password'); }

  isEmailInvalid(): boolean {
    return this.emailControl?.invalid && this.emailControl?.touched || false;
  }

  isPasswordInvalid(): boolean {
    return this.passwordControl?.invalid && this.passwordControl?.touched || false;
  }
}