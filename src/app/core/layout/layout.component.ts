import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalCartComponent } from '../../shared/components/modal-cart/modal-cart.component';
import { CartService } from '../services/cart.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ConfigService } from '../services/config.service';
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, ModalCartComponent, HeaderComponent],
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {
  isCartOpen = false;
  itemCount$ = this.cartService.cartItemCount$;

  siteName = 'BNRMarketplace';
  logoPath = '';
  logoExists = false;

  constructor(private cartService: CartService, private configService: ConfigService) {}

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  ngOnInit() {
    this.configService.loadConfig().subscribe(config => {
      this.siteName = config.siteName;
      this.logoPath = config.logoPath;
      this.checkLogoExists();
    });
  }

  private checkLogoExists() {
    const img = new Image();
    img.onload = () => {
      this.logoExists = true;
    };
    img.onerror = () => {
      this.logoExists = false;
    };
    img.src = this.logoPath;
  }
}
