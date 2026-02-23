import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="cart-container">
      <h2>Your Cart ({{ cartService.totalItems() }} items)</h2>

      <div *ngIf="cartService.cartItems().length === 0" class="empty-cart">
        <p>Your cart is empty.</p>
      </div>

      <div *ngIf="cartService.cartItems().length > 0">
        <div class="cart-items">
          <div class="cart-item" *ngFor="let item of cartService.cartItems()">
            <img [src]="item.imageUrl" [alt]="item.name" class="item-image">
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              <p class="item-price">\${{ item.price.toFixed(2) }}</p>
            </div>
            <div class="item-actions">
              <button class="quantity-btn" (click)="updateQuantity(item.id, item.cartQuantity - 1)">-</button>
              <span class="quantity">{{ item.cartQuantity }}</span>
              <button class="quantity-btn" (click)="updateQuantity(item.id, item.cartQuantity + 1)">+</button>
              
              <button class="remove-btn" (click)="removeItem(item.id)">Remove</button>
            </div>
            <div class="item-total">
              \${{ (item.price * item.cartQuantity).toFixed(2) }}
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-row total">
            <span>Total:</span>
            <span>\${{ cartService.totalPrice().toFixed(2) }}</span>
          </div>
          
          <button 
            class="checkout-btn" 
            [disabled]="cartService.isCheckingOut()"
            (click)="checkout()">
            {{ cartService.isCheckingOut() ? 'Processing...' : 'Checkout' }}
          </button>
        </div>
      </div>
    </div>
  `,
    styleUrls: ['./cart.component.css']
})
export class CartComponent {
    public cartService = inject(CartService);

    updateQuantity(productId: string, newQuantity: number) {
        this.cartService.updateQuantity(productId, newQuantity);
    }

    removeItem(productId: string) {
        this.cartService.removeFromCart(productId);
    }

    checkout() {
        this.cartService.checkout();
    }
}
