import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, tap, throwError, switchMap, of } from 'rxjs';
import { Product } from '../../shared/components/product/product.component';
import { environment } from '../../../environments/environment';

export interface ProductFilters {
  search?: string;
  min_price?: string;
  max_price?: string;
  per_page?: number;
  page?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.url}/products`;
  private readonly consumerKey = environment.consumerKey;
  private readonly consumerSecret = environment.consumerSecret;

  constructor(private http: HttpClient) {
    console.log('ProductService initialized with API URL:', this.apiUrl);
  }

  getProducts(categoryId?: number | null, filters: ProductFilters = {}): Observable<Product[]> {
    console.log('Category ID:', categoryId);
    console.log('Filters received:', filters);

    const params = new URLSearchParams({
      consumer_key: this.consumerKey,
      consumer_secret: this.consumerSecret,
      per_page: '100'
    });

    if (categoryId) {
      params.append('category', categoryId.toString());
    }

    if (filters.search) {
      params.append('search', filters.search);
    }

    if (filters.min_price) {
      params.append('min_price', filters.min_price);
    }

    if (filters.max_price) {
      params.append('max_price', filters.max_price);
    }

    const url = `${this.apiUrl}?${params.toString()}`;
    console.log('Request URL:', url);

    return this.http.get<Product[]>(url).pipe(
      tap(products => console.log('Products received:', products)),
      catchError(error => {
        console.error('Error fetching products:', error);
        return throwError(() => error);
      })
    );
  }

  getProduct(id: number): Observable<Product> {
    const searchParams = new URLSearchParams({
      consumer_key: this.consumerKey,
      consumer_secret: this.consumerSecret
    });

    const url = `${this.apiUrl}/${id}?${searchParams.toString()}`;
    console.log('Fetching single product from:', url);

    return this.http.get<any>(url).pipe(
      map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        regular_price: product.regular_price,
        sale_price: product.sale_price,
        images: product.images,
        stock_status: product.stock_status,
        sku: product.sku || '',
        categories: product.categories?.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug
        })) || []
      })),
      catchError(error => {
        console.error(`Error fetching product ${id}:`, error);
        console.error('Full error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          error: error.error
        });
        return throwError(() => new Error('Erreur lors du chargement du produit'));
      })
    );
  }

  private mapWooCommerceProduct(product: any): Product {
    try {
      const mappedProduct = {
        id: product.id,
        name: product.name,
        description: product.description?.rendered || product.description || '',
        price: product.price || '0',
        regular_price: product.regular_price || product.price || '0',
        sale_price: product.sale_price || '',
        images: (product.images || []).map((image: any) => ({
          id: image.id,
          src: image.src,
          alt: image.alt || product.name
        })),
        stock_status: product.stock_status || 'instock',
        sku: product.sku || ''
      };
      console.log('Mapped product:', mappedProduct);
      return mappedProduct;
    } catch (error) {
      console.error('Error mapping product:', error, 'Product data:', product);
      throw error;
    }
  }
}
