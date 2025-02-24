import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WooCommerceService, Category } from '../../services/woocommerce.service';
import { ArchiveBlogSkeletonComponent } from "../../../shared/components/skeleton/archive-blog-skeleton/archive-blog-skeleton.component";

interface CategoryWithUI extends Category {
  isExpanded: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  //styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ArchiveBlogSkeletonComponent]
})
export class SidebarComponent implements OnInit {
  categories: CategoryWithUI[] = [];
  filteredCategories: CategoryWithUI[] = [];
  searchTerm: string = '';
  loading = false;
  error: string | null = null;

  constructor(private woocommerce: WooCommerceService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  toggleCategory(category: CategoryWithUI): void {
    category.isExpanded = !category.isExpanded;
  }

  private loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.woocommerce.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data.map(cat => ({
          ...cat,
          isExpanded: false
        }));
        this.filteredCategories = this.categories;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error = 'Impossible de charger les catégories';
        this.loading = false;
      }
    });
  }

  getChildCategories(parentId: number): CategoryWithUI[] {
    return this.categories.filter(cat => cat.parent === parentId);
  }

  hasChildren(categoryId: number): boolean {
    return this.categories.some(cat => cat.parent === categoryId);
  }

  filterCategories(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = this.categories;
      return;
    }

    const search = this.searchTerm.toLowerCase().trim();
    this.filteredCategories = this.categories.filter(category => 
      category.name.toLowerCase().includes(search)
    );
  }

  onSearchChange(event: any): void {
    this.searchTerm = event.target.value;
    this.filterCategories();
  }
}
