import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-test-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './test-login.component.html',
  styleUrls: ['./test-login.component.scss'],
})
export class TestLoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // onSubmit(): void {
  //   if (this.loginForm.invalid) {
  //     return;
  //   }

  //   this.isLoading = true;
  //   this.errorMessage = '';
  //   this.successMessage = '';

  //   const { username, password } = this.loginForm.value;

  //   this.authService.login(username, password).subscribe({
  //     next: (response) => {
  //       this.isLoading = false;
  //       this.successMessage = 'Login successful!';
  //       console.log('Login response:', response);

  //       // Redirect after successful login (optional)
  //       // setTimeout(() => this.router.navigate(['/dashboard']), 1500);
  //     },
  //     error: (error) => {
  //       this.isLoading = false;
  //       this.errorMessage =
  //         error.error?.message ||
  //         'Login failed. Please check your credentials.';
  //       console.error('Login error:', error);
  //     },
  //   });
  // }
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Login successful!';
        console.log('Login response:', response);

        // Redirect after successful login (optional)
        // setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Component login error:', error);

        // Gestion des différents types d'erreurs
        if (error.status === 403 || error.status === 401) {
          this.errorMessage =
            "Identifiants incorrects. Veuillez vérifier votre nom d'utilisateur et mot de passe.";
        } else if (error.status === 0) {
          this.errorMessage =
            'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.';
        } else {
          this.errorMessage =
            error.error?.message ||
            'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
        }
      },
    });
  }
}
