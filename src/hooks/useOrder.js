import { openWhatsApp } from '@/utils/whatsapp'

/**
 * Hook para manejar órdenes de productos
 * @returns { createOrder, loading, error }
 */
export function useOrder() {
  const createOrder = async (product, producerPhone, quantity = 1) => {
    if (!producerPhone) {
      throw new Error('El productor no ha registrado su número de WhatsApp')
    }

    if (!product) {
      throw new Error('Producto no válido')
    }

    if (product.quantity < quantity) {
      throw new Error('Cantidad no disponible')
    }

    // Abrir WhatsApp con mensaje personalizado
    openWhatsApp(producerPhone, {
      productName: product.name,
      quantity,
      price: product.price,
      totalPrice: product.price * quantity,
    })

    return {
      success: true,
      message: 'Abierto WhatsApp para realizar la orden',
    }
  }

  return {
    createOrder,
  }
}
