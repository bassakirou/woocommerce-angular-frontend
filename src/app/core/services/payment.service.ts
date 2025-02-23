import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaymentMethod {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiUrl = `${environment.url}/payment_gateways`;

  constructor(private http: HttpClient) {
    console.log('PaymentService initialized with URL:', this.apiUrl);
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    const params = new URLSearchParams({
      consumer_key: environment.consumerKey,
      consumer_secret: environment.consumerSecret
    });

    const url = `${this.apiUrl}?${params.toString()}`;
    console.log('Fetching payment methods from:', url);

    return this.http.get<PaymentMethod[]>(url);
  }
}
