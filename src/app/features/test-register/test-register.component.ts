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

@Component({
  selector: 'app-test-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './test-register.component.html',
  styleUrls: ['./test-register.component.scss'],
})
export class TestRegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: [''],
      lastName: [''],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { username, email, password, firstName, lastName } =
      this.registerForm.value;

    this.authService
      .register(username, email, password, firstName, lastName)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Registration successful! You can now login.';
          console.log('Registration response:', response);

          // Si l'API renvoie un token, connecter automatiquement l'utilisateur
          if (response.token) {
            // Stocker le token et rediriger
            localStorage.setItem('auth_token', response.token);
            setTimeout(() => this.router.navigate(['/dashboard']), 1500);
          } else {
            // Rediriger vers la page de connexion
            setTimeout(() => this.router.navigate(['/test-login']), 2000);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.message || "L'inscription a échoué. Veuillez réessayer.";
          console.error('Registration error in component:', error);
        },
      });
  }
}
