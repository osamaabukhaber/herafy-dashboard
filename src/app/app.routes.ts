import { Routes } from '@angular/router';
import { MainComponent } from './features/main-component/main-component';
import {NotFoundComponent } from './shared/components/notfound/notfound';
import { User } from './features/user/user';
import { ProductListComponent } from './features/products/components/product-list/product-list.component';
import { StoreComponent } from './features/store/components/store-component/store-component';
import { StoreAddedNewstoreComponent } from './features/store/components/store-added-newstore-component/store-added-newstore-component';
import { StoreUpdateSroreComponent } from './features/store/components/store-update-srore-component/store-update-srore-component';
import { StoreViewComponent } from './features/store/components/store-view-component/store-view-component';
import { CartMainComponent } from './features/cart/components/cart-main-component/cart-main-component';
import { AdminCartFormComponent } from './features/cart/components/cart-create-component/cart-create-component';
import { AdminCartUpdateComponent } from './features/cart/components/cart-update-component/cart-update-component';
import { CartViewComponent } from './features/cart/components/cart-view-component/cart-view-component';
import { AdminPaymentManagementComponent } from './features/payments/components/payments-main-component/payments-main-component';
import { PaymentsViewComponent } from './features/payments/components/payments-view-component/payments-view-component';
// import { ProductFormComponent } from './features/products/components/product-form/product-form.component';
// import { ProductDetailComponent } from './features/products/components/product-detail/product-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'user', component: User },
      { path: 'products', component: ProductListComponent },
      {path:"store",component:StoreComponent ,title:"store mangement"},
      {path:"add-new-store", component:StoreAddedNewstoreComponent ,title:"add new store"},
      {path: 'update-store/:id', component: StoreUpdateSroreComponent, title: "update store"},
      {path: 'view-store/:id', component: StoreViewComponent, title: "view store"},
      {path:"cart", component:CartMainComponent , title:"cart mangement"},
      {path:"createcart", component:AdminCartFormComponent , title:"create cart"},
      {path:"updatecart/:id", component:AdminCartUpdateComponent , title:"update cart"},
      {path:"viewcart/:id", component:CartViewComponent , title:"view cart"},
      {path:"payments", component:AdminPaymentManagementComponent , title:"payments mangement"},
      { path: 'view-payment/:id', component: PaymentsViewComponent, title: 'view payment' },
      // { path: 'products/create',   },
      // { path: 'products/:id', component: ProductDetailComponent },
      // { path: 'products/:id/edit',  }
    ],
  },

  { path: '**', component: NotFoundComponent, title: 'Not Found' },
];
