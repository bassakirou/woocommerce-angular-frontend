import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../shared/components/product/product.component';
import { StorageService } from './storage.service';
import { ToastService } from '../../shared/services/toast.service';
import { TOAST_MESSAGES } from '../../shared/constants/toast-messages';

export interface CartItem extends Product {
  quantity: number;
}

const CART_STORAGE_KEY = 'wc_cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  cartItemCount$ = this.cart$.pipe(
    map(items => items.reduce((count, item) => count + (item.quantity || 0), 0))
  );

  constructor(
    private storage: StorageService,
    private toastService: ToastService
  ) {
    this.loadCart();
  }

  private loadCart(): void {
    try {
      const savedCart = this.storage.getItem<CartItem[]>(CART_STORAGE_KEY);
      this.cartSubject.next(savedCart || []);
    } catch (error) {
      this.toastService.showError(TOAST_MESSAGES.cart.update.error);
    }
  }

  private saveCart(cart: CartItem[]): void {
    try {
      this.storage.setItem(CART_STORAGE_KEY, cart);
      this.cartSubject.next(cart);
    } catch (error) {
      this.toastService.showError(TOAST_MESSAGES.cart.update.error);
    }
  }

  addToCart(product: Product, quantity: number = 1): Observable<void> {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      currentCart.push({ ...product, quantity });
    }

    this.saveCart(currentCart);
    this.toastService.showSuccess(TOAST_MESSAGES.cart.update.success);
    return new Observable(subscriber => {
      subscriber.next();
      subscriber.complete();
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    try {
      const currentCart = this.cartSubject.value;
      const updatedCart = currentCart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      );
      this.saveCart(updatedCart);
      this.toastService.showSuccess(TOAST_MESSAGES.cart.update.success);
    } catch (error) {
      this.toastService.showError(TOAST_MESSAGES.cart.update.error);
    }
  }

  removeFromCart(productId: number): void {
    try {
      const currentCart = this.cartSubject.value;
      const updatedCart = currentCart.filter(item => item.id !== productId);
      this.saveCart(updatedCart);
      this.toastService.showSuccess(TOAST_MESSAGES.cart.remove.success);
    } catch (error) {
      this.toastService.showError(TOAST_MESSAGES.cart.remove.error);
    }
  }

  clearCart(): void {
    try {
      this.storage.removeItem(CART_STORAGE_KEY);
      this.cartSubject.next([]);
      this.toastService.showSuccess(TOAST_MESSAGES.cart.hideCart.success);
    } catch (error) {
      this.toastService.showError(TOAST_MESSAGES.cart.hideCart.error);
    }
  }

  getTotal(): Observable<number> {
    return this.cart$.pipe(
      map(items => items.reduce((total, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) : item.price;
        return total + (price * (item.quantity || 0));
      }, 0))
    );
  }
}
