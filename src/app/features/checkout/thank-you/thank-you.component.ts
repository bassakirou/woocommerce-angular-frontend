import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './thank-you.component.html',
})
export class ThankYouComponent {
  orderId: string | null = null;
  accountCreated = false;
  isLoading = true;
  orderDetails: any = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    // Récupérer l'ID de commande depuis les paramètres d'URL
    this.route.queryParams.subscribe((params) => {
      this.orderId = params['order_id'];

      // Vérifier si un compte a été créé
      this.accountCreated = localStorage.getItem('account_created') === 'true';

      // Nettoyer le localStorage après récupération
      if (this.accountCreated) {
        localStorage.removeItem('account_created');
      }

      // Charger les détails de la commande si l'ID est disponible
      if (this.orderId) {
        this.loadOrderDetails(this.orderId);
      } else {
        this.isLoading = false;
      }
    });
  }

  loadOrderDetails(orderId: string) {
    // Change getOrder to the correct method name from your OrderService
    this.orderService.getOrderById(parseInt(orderId)).subscribe({
      next: (order) => {
        this.orderDetails = order;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Impossible de charger les détails de la commande.';
        this.isLoading = false;
        console.error('Erreur de chargement de la commande:', error);
      },
    });
  }
}
