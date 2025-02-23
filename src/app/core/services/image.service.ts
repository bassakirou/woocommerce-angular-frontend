import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly productPlaceholder = 'assets/images/placeholders/market-placeholder.jpg';

  getProductImageUrl(product: any): string {
    if (product?.images?.length > 0 && product.images[0]?.src) {
      return product.images[0].src;
    }
    return this.productPlaceholder;
  }
}
