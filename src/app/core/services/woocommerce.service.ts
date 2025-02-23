import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../../shared/components/product/product.component';

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  count: number;
}

export interface ProductFilters {
  search?: string;
  min_price?: string;
  max_price?: string;
  category?: number;
  per_page?: number;
  page?: number;
}

@Injectable({
  providedIn: 'root'
})
export class WooCommerceService {
  private readonly apiUrl = environment.url;
  private readonly consumerKey = environment.consumerKey;
  private readonly consumerSecret = environment.consumerSecret;

  constructor(private http: HttpClient) {}

  getProducts(filters: ProductFilters = {}): Observable<Product[]> {
    let params = new HttpParams()
      .set('consumer_key', this.consumerKey)
      .set('consumer_secret', this.consumerSecret);

    // Ajouter les filtres aux paramètres
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }

  getProduct(id: number): Observable<Product> {
    const params = new HttpParams()
      .set('consumer_key', this.consumerKey)
      .set('consumer_secret', this.consumerSecret);

    return this.http.get<Product>(`${this.apiUrl}/products/${id}`, { params });
  }

  getCategories(): Observable<Category[]> {
    const params = new HttpParams()
      .set('consumer_key', this.consumerKey)
      .set('consumer_secret', this.consumerSecret)
      .set('per_page', '100')
      .set('orderby', 'name')
      .set('order', 'asc');

    return this.http.get<Category[]>(`${this.apiUrl}/products/categories`, { params });
  }
}
