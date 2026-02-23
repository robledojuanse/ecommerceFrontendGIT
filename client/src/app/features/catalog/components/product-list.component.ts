import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../catalog.service';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-container">
      <h2>Product Catalog</h2>

      <div *ngIf="loading$ | async" class="loading-state">
        <div class="spinner"></div>
        <p>Loading products...</p>
      </div>

      <div *ngIf="error$ | async as error" class="error-state">
        <p>{{ error }}</p>
      </div>

      <div class="product-grid" *ngIf="(loading$ | async) === false && (error$ | async) === null">
        <div class="product-card" *ngFor="let product of products$ | async">
          <img [src]="product.imageUrl" [alt]="product.name" class="product-image">
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="description">{{ product.description }}</p>
            <div class="card-footer">
              <span class="price">\${{ product.price.toFixed(2) }}</span>
              <button 
                class="btn-primary" 
                (click)="addToCart(product)"
                [disabled]="product.stock === 0">
                {{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
              </button>
            </div>
            <p class="stock-info" [class.low-stock]="product.stock < 10 && product.stock > 0" [class.no-stock]="product.stock === 0">
              {{ product.stock > 0 ? product.stock + ' in stock' : 'Out of Stock' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private cartService = inject(CartService);

  products$ = this.catalogService.products$;
  loading$ = this.catalogService.loading$;
  error$ = this.catalogService.error$;

  ngOnInit() {
    this.catalogService.loadProducts();
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
}
