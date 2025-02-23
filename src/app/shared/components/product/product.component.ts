import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { TOAST_MESSAGES } from '../../constants/toast-messages';
import { ProductService } from '../../../core/services/product.service';
import { ModalProductViewComponent } from "../modal-product-view/modal-product-view.component";

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: Array<{src: string}>;
  stock_status?: string;
  categories?: Category[];
  sku: string; 
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalProductViewComponent],
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
  @Input() product!: Product;
  @Output() addToCartClicked = new EventEmitter<Product>();
  @Output() productClicked = new EventEmitter<Product>();
  categoryId: number | null = null;
  isOpen = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
    
    
  ) {}

  ngOnInit() {
    // this.route.queryParams.subscribe(params => {
    //   this.categoryId = params['category'] ? +params['category'] : null;
    //   this.loadProducts();
    // });
  }

  openModal() {
    return this.isOpen = true;
  }

  onAddToCart(event: Event | { product: Product; quantity: number }): void {
    if (event instanceof Event) {
      event.stopPropagation();
      event.preventDefault(); 
      this.cartService.addToCart(this.product, 1).subscribe(() => {
        // Success
      });
    } else {
      const { product, quantity } = event;
      this.cartService.addToCart(product, quantity || 1).subscribe(() => {
        this.isOpen = false;
      });
    }
  }

  onProductClick(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isOpen = true;
    this.productClicked.emit(this.product);
  }

  getPrice(): string {
    return this.product.sale_price || this.product.price || '0';
  }
}
