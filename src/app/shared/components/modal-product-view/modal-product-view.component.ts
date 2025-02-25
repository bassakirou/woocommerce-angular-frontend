import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Product, Category } from '../product/product.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-product-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './modal-product-view.component.html'
})
export class ModalProductViewComponent {
  @Input() set product(value: Product | null) {
    console.log('Product in modal:', value);
    if (value) {
      console.log('Product categories:', value.categories);
    }
    this._product = value;
  }
  get product(): Product | null {
    return this._product;
  }
  private _product: Product | null = null;

  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<{product: Product, quantity: number}>();

  currentImageIndex = 0;
  quantity = 1;

  constructor(private router: Router) {}

  onClose(): void {
    this.closeModal.emit();
    this.currentImageIndex = 0;
    this.quantity = 1;
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    if (this.product) {
      this.addToCart.emit({
        product: this.product,
        quantity: this.quantity
      });
      this.quantity = 1;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  onQuantityChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);
    
    if (isNaN(value) || value < 1) {
      value = 1;
    }
    
    this.quantity = value;
  }

  getPrice(): string {
    if (!this.product) return '0';
    return this.product.sale_price || this.product.price || '0';
  }

  nextImage(): void {
    if (this.product?.images && this.currentImageIndex < this.product.images.length - 1) {
      this.currentImageIndex++;
    }
  }

  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  hasGallery(): boolean {
    return this.product?.images && this.product.images.length > 1 || false;
  }

  navigateToCategory(category: Category): void {
    this.onClose();
    this.router.navigate(['/'], { 
      queryParams: { category: category.id }
    });
  }
}
