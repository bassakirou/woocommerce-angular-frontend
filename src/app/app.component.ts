import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LayoutComponent,
    ToastComponent
  ],
  template: `
    <app-layout></app-layout>
    <app-toast></app-toast>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'woocommerce-angular-frontend';
}
