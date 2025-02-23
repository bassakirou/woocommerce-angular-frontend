import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalCartComponent } from '../../shared/components/modal-cart/modal-cart.component';
import { CartService } from '../services/cart.service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, ModalCartComponent],
  templateUrl: './layout.component.html'
})
export class LayoutComponent {
  isCartOpen = false;
  itemCount$ = this.cartService.cartItemCount$;

  constructor(private cartService: CartService) {}

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }
}
