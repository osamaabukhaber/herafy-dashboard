import { Routes } from '@angular/router';
import { MainComponent } from './features/main-component/main-component';
import { Notfound } from './shared/components/notfound/notfound';
import { User } from './features/user/user';
import { ProductListComponent } from './features/products/components/product-list/product-list.component';
// import { ProductFormComponent } from './features/products/components/product-form/product-form.component';
// import { ProductDetailComponent } from './features/products/components/product-detail/product-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'user', component: User },
      { path: 'products', component: ProductListComponent },
      // { path: 'products/create',   },
      // { path: 'products/:id', component: ProductDetailComponent },
      // { path: 'products/:id/edit',  }
    ],
  },

  { path: '**', component: Notfound },
];
