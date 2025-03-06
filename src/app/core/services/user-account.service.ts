import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {
  private siteUrl = environment.siteUrl;

  constructor(private http: HttpClient) {}

  /**
   * Crée un compte utilisateur automatiquement lors de la commande
   */
  createAccountFromOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.siteUrl}/wp-json/wc/v3/auto-account`, {
      email: orderData.billing.email,
      first_name: orderData.billing.first_name,
      last_name: orderData.billing.last_name || '',
      order_id: orderData.id
    });
  }
}