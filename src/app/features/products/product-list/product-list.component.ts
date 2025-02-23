import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ProductComponent } from '../../../shared/components/product/product.component';
import { ModalProductViewComponent } from '../../../shared/components/modal-product-view/modal-product-view.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, ProductComponent, ModalProductViewComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: any[] = [];
  filteredProducts: any[] = [];
  loading = false;
  error = '';
  currentSearch = '';
  currentCategory: number | null = null;
  priceRange = { min: 0, max: 0 };
  private queryParamSubscription?: Subscription;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.queryParamSubscription = this.route.queryParams.subscribe(params => {
      this.currentCategory = params['category'] ? +params['category'] : null;
      this.loadProducts();
    });
  }

  ngOnDestroy() {
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts(this.currentCategory).subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.updatePriceRange();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
        this.error = 'Erreur lors du chargement des produits';
        this.loading = false;
      }
    });
  }

  onSearch(query: string) {
    this.currentSearch = query;
    this.applyFilters();
  }

  onPriceChange(range: { min: number; max: number }) {
    this.priceRange = range;
    this.applyFilters();
  }

  private updatePriceRange() {
    if (this.products.length > 0) {
      const prices = this.products.map(p => Number(p.price));
      this.priceRange.min = Math.min(...prices);
      this.priceRange.max = Math.max(...prices);
    }
  }

  private applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.currentSearch || 
        product.name.toLowerCase().includes(this.currentSearch.toLowerCase()) ||
        product.sku.toLowerCase().includes(this.currentSearch.toLowerCase());
      
      const price = Number(product.price);
      const matchesPrice = price <= this.priceRange.max;

      return matchesSearch && matchesPrice;
    });
  }

  onAddToCart(product: any) {
    this.cartService.addToCart(product);
  }

  onProductClick(product: any) {
    // TODO: Implémenter la vue détaillée du produit
    console.log('Produit cliqué:', product);
  }
}
