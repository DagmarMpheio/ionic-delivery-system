import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'password-reset',
    loadChildren: () => import('./password-reset/password-reset.module').then( m => m.PasswordResetPageModule)
  },
  {
    path: 'add-product',
    loadChildren: () => import('./products/add-product/add-product.module').then( m => m.AddProductPageModule)
  },
  {
    path: 'product-list',
    loadChildren: () => import('./products/product-list/product-list.module').then( m => m.ProductListPageModule)
  },
  {
    path: 'update-product/:id',
    loadChildren: () => import('./products/update-product/update-product.module').then( m => m.UpdateProductPageModule)
  },
  {
    path: 'discount-modal',
    loadChildren: () => import('./products/discount-modal/discount-modal.module').then( m => m.DiscountModalPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
