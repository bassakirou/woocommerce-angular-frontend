import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../shared/services/toast.service';
import { PaymentService } from '../../../core/services/payment.service';
import { Observable, take, firstValueFrom, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems$ = this.cartService.cart$;
  isSubmitting = false;
  paymentMethods: any[] = [];
  total$ = new BehaviorSubject<number>(0);

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastService,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      paymentMethod: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Charger les méthodes de paiement
    this.paymentService.getPaymentMethods().subscribe({
      next: (methods) => {
        this.paymentMethods = methods.filter(method => method.enabled);
        if (this.paymentMethods.length > 0) {
          this.checkoutForm.patchValue({
            paymentMethod: this.paymentMethods[0].id
          });
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des méthodes de paiement:', error);
      }
    });

    // Calculer le total
    this.cartItems$.subscribe(items => {
      const total = items.reduce((sum, item) => {
        return sum + (this.parseFloat(item.price) * item.quantity);
      }, 0);
      this.total$.next(total);
    });
  }

  parseFloat(value: string | number): number {
    return typeof value === 'string' ? Number.parseFloat(value) : value;
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.cartService.removeFromCart(productId);
    } else {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  async onSubmit() {
    if (this.checkoutForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.checkoutForm.value;

    try {
      const cartItems = await firstValueFrom(this.cartItems$.pipe(take(1)));
      const selectedPaymentMethod = this.paymentMethods.find(m => m.id === formValue.paymentMethod);
      
      const orderData = {
        payment_method: formValue.paymentMethod,
        payment_method_title: selectedPaymentMethod?.title || 'Paiement à la livraison',
        billing: {
          first_name: formValue.fullName,
          email: formValue.email,
          phone: formValue.phone,
          address_1: formValue.address
        },
        shipping: {
          first_name: formValue.fullName,
          address_1: formValue.address
        },
        line_items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      await firstValueFrom(this.orderService.createOrder(orderData));
      this.cartService.clearCart();
      this.router.navigate(['/thank-you']);
    } catch (error) {
      this.isSubmitting = false;
      this.toastService.showError('Erreur lors de la validation de la commande. Veuillez réessayer.');
      console.error('Erreur commande:', error);
    }
  }
}
