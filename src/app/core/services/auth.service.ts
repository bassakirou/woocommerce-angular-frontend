import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private siteUrl = environment.siteUrl;
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http
      .post<any>(
        `${this.siteUrl}/wp-json/jwt-auth/v1/token`,
        {
          username,
          password,
        },
        httpOptions
      )
      .pipe(
        tap((response) => {
          if (response && response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem(
              this.userKey,
              JSON.stringify(response.user || {})
            );
            this.isAuthenticatedSubject.next(true);
          }
        }),
        catchError(this.handleError)
      );
    // return this.http
    //   .post<any>(`${this.siteUrl}/wp-json/jwt-auth/v1/token`, {
    //     username,
    //     password,
    //   })
    //   .pipe(
    //     tap((response) => {
    //       if (response && response.token) {
    //         localStorage.setItem(this.tokenKey, response.token);
    //         localStorage.setItem(
    //           this.userKey,
    //           JSON.stringify(response.user || {})
    //         );
    //         this.isAuthenticatedSubject.next(true);
    //       }
    //     })
    //   );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 403:
          errorMessage = 'Accès refusé. Vérifiez vos identifiants.';
          break;
        case 401:
          errorMessage = 'Non autorisé. Vérifiez vos identifiants.';
          break;
        case 404:
          errorMessage = "Service d'authentification non trouvé.";
          break;
        case 500:
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${
            error.error?.message || 'Une erreur inconnue est survenue'
          }`;
      }
    }

    console.error('Auth service error:', errorMessage);
    return throwError(() => error);
  }

  register(
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Observable<any> {
    const userData = {
      username,
      email,
      password,
      first_name: firstName || '',
      last_name: lastName || '',
    };

    return this.http
      .post<any>(`${this.siteUrl}/wp-json/wp/v2/users/register`, userData)
      .pipe(catchError(this.handleRegistrationError));
  }

  private handleRegistrationError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 404:
          errorMessage =
            "L'API d'enregistrement n'est pas disponible. Veuillez contacter l'administrateur.";
          break;
        case 400:
          errorMessage =
            error.error?.message || "Données d'enregistrement invalides.";
          break;
        case 409:
          errorMessage = 'Cet utilisateur ou cette adresse email existe déjà.';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${
            error.error?.message ||
            "Une erreur inconnue est survenue lors de l'enregistrement"
          }`;
      }
    }

    console.error('Registration error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserData(): any {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
