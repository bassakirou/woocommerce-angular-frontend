import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WooCommerceService } from '../../../core/services/woocommerce.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: any[] = [];

  constructor(
    private wooCommerceService: WooCommerceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.wooCommerceService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/category', categoryId]);
  }

  trackCategoryById(index: number, category: any): number {
    return category.id;
  }
}
