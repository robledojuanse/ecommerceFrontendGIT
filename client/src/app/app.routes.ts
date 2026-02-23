import { Routes } from '@angular/router';
import { ProductListComponent } from './features/catalog/components/product-list.component';
import { CartComponent } from './features/cart/components/cart.component';

export const routes: Routes = [
    { path: '', component: ProductListComponent, title: 'Catalog - MVP Market' },
    { path: 'cart', component: CartComponent, title: 'Your Cart - MVP Market' },
    { path: '**', redirectTo: '' }
];
