import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from './features/cart/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <div class="header-container">
        <h1 routerLink="/" class="logo" > <img src="assets/logo.svg" style="width: 50px; height: 50px; margin-right: 20px;" alt="Logo"> </h1><div style="margin-top:-15px; margin-left: -80%;" > Shelby </div>
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Catalog</a>
          <a routerLink="/cart" routerLinkActive="active" class="cart-link">
            Cart
            <span class="cart-badge" *ngIf="cartService.totalItems() > 0">
              {{ cartService.totalItems() }}
            </span>
          </a>
        </nav>
      </div>
    </header>

    <main class="app-content">
      <router-outlet></router-outlet>
    </main>

    <footer class="app-footer">
      <p>&copy; 2026 Lightweight Marketplace MVP</p>
    </footer>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cartService = inject(CartService);
}
