import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SiteConfig } from '../interfaces/site-config.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: SiteConfig | null = null;

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<SiteConfig> {
    return this.http.get<SiteConfig>('assets/config/site-config.json').pipe(
      catchError(() => of({
        siteName: 'BNRMarketplace',
        logoPath: 'assets/images/logo/logo.png'
      }))
    );
  }
}