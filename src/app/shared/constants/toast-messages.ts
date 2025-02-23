import { error } from "console";

export const TOAST_MESSAGES = {
  cart: {
    add: {
      success: 'Le produit a été ajouté au panier avec succès',
      error: 'Une erreur est survenue lors de l\'ajout du produit au panier'
    },
    update: {
      success: 'La quantité a été mise à jour avec succès',
      error: 'Une erreur est survenue lors de la mise à jour de la quantité'
    },
    remove: {
      success: 'Le produit a été retiré du panier',
      error: 'Une erreur est survenue lors de la suppression du produit'
    },
    hideCart: {
      success: 'Panier vidé avec succès',
      error: 'Erreur lors de la suppression du panier'
    }
  },
  order: {
    create: {
      success: 'Votre commande a été créée avec succès',
      error: 'Une erreur est survenue lors de la création de la commande'
    },
    cancel: {
      success: 'La commande a été annulée avec succès',
      error: 'Une erreur est survenue lors de l\'annulation de la commande'
    },
    update: {
      success: 'La commande a été mise à jour avec succès',
      error: 'Une erreur est survenue lors de la mise à jour de la commande'
    }
  }
};
