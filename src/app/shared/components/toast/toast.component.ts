import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      @for (toast of toasts$ | async; track toast.id) {
        <div 
          class="min-w-[300px] p-4 rounded-lg shadow-lg text-white"
          [class.bg-green-600]="toast.type === 'success'"
          [class.bg-red-600]="toast.type === 'error'"
          [@toastAnimation]
          (click)="removeToast(toast.id)">
          <div class="flex items-center gap-2">
            @if (toast.type === 'success') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
            {{ toast.message }}
          </div>
        </div>
      }
    </div>
  `,
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent {
  toasts$ = this.toastService.toasts$;

  constructor(private toastService: ToastService) {}

  removeToast(id: number): void {
    this.toastService.remove(id);
  }
}
