import { Routes } from '@angular/router';
import { MainComponent } from './features/main-component/main-component';
import { NotFoundComponent } from './shared/components/notfound/notfound';
import { User } from './features/user/user';
import { ProductListComponent } from './features/products/components/product-list/product-list.component';
import { ProductFormComponent } from './features/products/components/product-form/product-form.component';
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
import { CategoryComponent } from './features/category-component/category-component';
// import { ProductDetailComponent } from './features/products/components/product-detail/product-detail.component';
import { CouponComponent } from './features/coupon-component/coupon-component/coupon-component';
import { AuthGuard } from './core/guards/auth.guard';
import { Login } from './shared/login/login';
import { ReviewComponent } from './features/review-component/review-component';
import { OrderListComponent } from './features/orders/components/order-list/order-list.component.js';
import { OrderDetailComponent } from './features/orders/components/order-detail/order-detail.component.js';
import { CreateOrderComponent } from './features/orders/components/create-order/create-order.component.js';
import { ProductDetailComponent } from './features/products/components/product-detail/product-detail.component.js';
import { DashboardChartsComponent } from './features/charts-component/dashboard-charts/dashboard-charts';
import { Chatbot } from './features/chat bot/components/chatbot/chatbot';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    /* resolve: { loggedIn: AuthStatusResolver }, */
    canActivate: [AuthGuard], // optional now, could be removed
    children: [
      {path: 'charts', component: DashboardChartsComponent},
      {path: 'user', component: User },
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
      { path: 'coupon', component: CouponComponent },
      { path: 'reviews', component: ReviewComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'products/:id/edit', component: ProductDetailComponent },
      { path: 'products/:id/view', component: ProductDetailComponent },
      // { path: 'products/:id/edit',  }
      { path: 'products/create', component: ProductFormComponent, title: 'Create Product' },
      { path: 'category', component: CategoryComponent },
      { path: 'chatbot', component: Chatbot , title: "chatbot" },
      { path: 'orders', component: OrderListComponent, title: "orders" },
      { path: 'orders/create', component: CreateOrderComponent, title: "order" },
      { path: 'order-detail', component: OrderDetailComponent, title: "order detail" },
      // { path: 'create-order', component: CreateOrderComponent, title: "create order" },
    ],
  },
  { path: 'login', component: Login },
  { path: '**', component: NotFoundComponent, title: 'Not Found' },
];
