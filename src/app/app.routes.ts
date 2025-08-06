import { Routes } from '@angular/router';
import { MainComponent } from './features/main-component/main-component';
import {NotFoundComponent } from './shared/components/notfound/notfound';
import { User } from './features/user/user';
import { ProductListComponent } from './features/products/components/product-list/product-list.component';
import { StoreComponent } from './features/store/components/store-component/store-component';
import { StoreAddedNewstoreComponent } from './features/store/components/store-added-newstore-component/store-added-newstore-component';
import { StoreUpdateSroreComponent } from './features/store/components/store-update-srore-component/store-update-srore-component';
import { CategoryComponent } from './features/category-component/category-component';
// import { ProductFormComponent } from './features/products/components/product-form/product-form.component';
// import { ProductDetailComponent } from './features/products/components/product-detail/product-detail.component';
import { CouponComponent } from './features/coupon-component/coupon-component/coupon-component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'user', component: User },
      { path: 'products', component: ProductListComponent },
      { path:"store",component:StoreComponent ,title:"store"},
      { path:"add-new-store", component:StoreAddedNewstoreComponent ,title:"add new store"},
      { path: 'update/:id', component: StoreUpdateSroreComponent, title: "update store"},
      {path: 'category', component: CategoryComponent},
      {path: 'coupon', component: CouponComponent}
      // { path: 'products/create',   },
      // { path: 'products/:id', component: ProductDetailComponent },
      // { path: 'products/:id/edit',  }
    ],
  },

  { path: '**', component: NotFoundComponent, title: 'Not Found' },
];
