import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PriceRange {
  min: number;
  max: number;
  value: number;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  @Output() search = new EventEmitter<string>();
  @Output() priceFilter = new EventEmitter<{ min: number; max: number }>();

  @Input() placeholder: string = 'Rechercher un produit...';

  searchQuery: string = '';
  showPriceRange = true;
  
  priceRange: PriceRange = {
    min: 0,
    max: 350000,
    value: 350000
  };

  constructor() {}

  ngOnInit(): void {
    // Émettre les valeurs initiales
    this.onPriceChange();
  }

  onSearch(): void {
    this.search.emit(this.searchQuery);
  }

  onPriceChange(): void {
    this.priceFilter.emit({
      min: this.priceRange.min,
      max: this.priceRange.value
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.search.emit('');
  }
}
