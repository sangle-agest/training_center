import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  errorMessage = '';
  loading = false;
  returnUrl: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get return URL from route parameters
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  redirectToDashboard(): void {
    if (this.returnUrl) {
      console.log('Redirecting to returnUrl:', this.returnUrl);
      this.router.navigateByUrl(this.returnUrl);
    } else {
      const user = this.authService.currentUserValue;
      if (user?.role === 'admin') {
        console.log('Redirecting admin to /admin');
        this.router.navigate(['/admin']);
      } else {
        console.log('Redirecting learner to /learn');
        this.router.navigate(['/learn']);
      }
    }
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.redirectToDashboard();
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.error?.message || 'Login failed. Please check your credentials.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
