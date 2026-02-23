import { Injectable, computed, signal, inject } from '@angular/core';
import { Product, OrderItem } from '@shared/types/index';
import { ApiService } from '../../core/services/api.service';
import { tap, finalize } from 'rxjs';

export type CartItem = Product & {
    cartQuantity: number;
};

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private api = inject(ApiService);

    // State Management via Angular 17+ Signals
    private cartItemsSignal = signal<CartItem[]>([]);
    public isCheckingOut = signal<boolean>(false);

    // Computed Signals
    public cartItems = this.cartItemsSignal.asReadonly();
    public totalItems = computed(() =>
        this.cartItemsSignal().reduce((total, item) => total + item.cartQuantity, 0)
    );
    public totalPrice = computed(() =>
        this.cartItemsSignal().reduce((total, item) => total + (item.price * item.cartQuantity), 0)
    );

    addToCart(product: Product) {
        this.cartItemsSignal.update(items => {
            const existing = items.find(i => i.id === product.id);
            if (existing) {
                if (existing.cartQuantity < existing.stock) {
                    return items.map(i => i.id === product.id ? { ...i, cartQuantity: i.cartQuantity + 1 } : i);
                }
                alert('Not enough stock available!');
                return items;
            }
            return [...items, { ...product, cartQuantity: 1 }];
        });
    }

    removeFromCart(productId: string) {
        this.cartItemsSignal.update(items => items.filter(i => i.id !== productId));
    }

    updateQuantity(productId: string, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        this.cartItemsSignal.update(items => {
            return items.map(i => {
                if (i.id === productId) {
                    if (quantity <= i.stock) {
                        return { ...i, cartQuantity: quantity };
                    } else {
                        alert('Not enough stock available!');
                        return i;
                    }
                }
                return i;
            });
        });
    }

    clearCart() {
        this.cartItemsSignal.set([]);
    }

    checkout(userId: string = 'test-user-123') {
        if (this.cartItemsSignal().length === 0) return;

        this.isCheckingOut.set(true);

        const checkoutPayload = {
            userId,
            items: this.cartItemsSignal().map(item => ({
                productId: item.id,
                quantity: item.cartQuantity
            }))
        };

        this.api.post('/orders/checkout', checkoutPayload)
            .pipe(
                tap({
                    next: () => {
                        alert('Checkout successful!');
                        this.clearCart();
                    },
                    error: (err) => {
                        console.error('Checkout failed', err);
                    }
                }),
                finalize(() => this.isCheckingOut.set(false))
            )
            .subscribe();
    }
}
