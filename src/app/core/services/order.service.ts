import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface OrderData {
  payment_method: string;
  payment_method_title: string;
  billing: {
    first_name: string;
    email: string;
    phone: string;
    address_1: string;
  };
  shipping: {
    first_name: string;
    address_1: string;
  };
  line_items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = `${environment.url}/orders`;
  private readonly consumerKey = environment.consumerKey;
  private readonly consumerSecret = environment.consumerSecret;

  constructor(private http: HttpClient) {}

  createOrder(orderData: OrderData): Observable<any> {
    const params = new URLSearchParams({
      consumer_key: this.consumerKey,
      consumer_secret: this.consumerSecret
    });

    return this.http.post(`${this.apiUrl}?${params.toString()}`, orderData)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la création de la commande:', error);
          return throwError(() => error);
        })
      );
  }
}
