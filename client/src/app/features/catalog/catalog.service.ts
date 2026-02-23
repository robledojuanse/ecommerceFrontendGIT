import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, tap, finalize } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Product } from '@shared/types/index';

@Injectable({
    providedIn: 'root'
})
export class CatalogService {
    private api = inject(ApiService);

    // State Management via BehaviorSubjects
    private productsSubject = new BehaviorSubject<Product[]>([]);
    public products$ = this.productsSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    private errorSubject = new BehaviorSubject<string | null>(null);
    public error$ = this.errorSubject.asObservable();

    loadProducts(category?: string, search?: string) {
        this.loadingSubject.next(true);
        this.errorSubject.next(null);

        const params: any = {};
        if (category) params.category = category;
        if (search) params.search = search;

        this.api.get<Product[]>('/products', params)
            .pipe(
                tap({
                    next: (response) => {
                        if (response.status === 'success' && response.data) {
                            this.productsSubject.next(response.data);
                        }
                    },
                    error: (err) => {
                        this.errorSubject.next(err.message || 'Failed to load products');
                    }
                }),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe();
    }
}
