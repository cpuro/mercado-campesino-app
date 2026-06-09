import { openWhatsApp as openWhatsAppUtil } from '@/utils/whatsapp'

/**
 * Servicio para manejar órdenes de productos
 */

export const orderService = {
  /**
   * Valida que se puede hacer una orden
   * @param { Object } product - Producto
   * @param { string } producerPhone - Teléfono del productor
   * @param { number } quantity - Cantidad
   * @returns { Object } { isValid, error }
   */
  validateOrder(product, producerPhone, quantity = 1) {
    if (!product) {
      return { isValid: false, error: 'Producto no válido' }
    }

    if (!producerPhone) {
      return {
        isValid: false,
        error: 'El productor no ha registrado su número de WhatsApp',
      }
    }

    if (quantity <= 0) {
      return { isValid: false, error: 'Cantidad inválida' }
    }

    if (product.quantity < quantity) {
      return { isValid: false, error: 'Cantidad no disponible' }
    }

    return { isValid: true }
  },

  /**
   * Crea una orden (abre WhatsApp)
   * @param { Object } product - Producto
   * @param { string } producerPhone - Teléfono del productor
   * @param { number } quantity - Cantidad a ordenar
   * @returns { Object } Resultado de la operación
   */
  async createOrder(product, producerPhone, quantity = 1) {
    const validation = this.validateOrder(product, producerPhone, quantity)

    if (!validation.isValid) {
      throw new Error(validation.error)
    }

    try {
      const totalPrice = product.price * quantity

      openWhatsAppUtil(producerPhone, {
        productName: product.name,
        quantity,
        price: product.price,
        totalPrice,
      })

      return {
        success: true,
        message: 'Orden enviada a WhatsApp',
        data: {
          productId: product.id,
          producerId: product.producer_id,
          quantity,
          totalPrice,
          timestamp: new Date().toISOString(),
        },
      }
    } catch (error) {
      console.error('Error creating order:', error)
      throw new Error('Error al crear la orden')
    }
  },

  /**
   * Genera un resumen de orden para registro
   * @param { Object } product - Producto
   * @param { number } quantity - Cantidad
   * @returns { Object } Resumen
   */
  generateOrderSummary(product, quantity = 1) {
    const totalPrice = product.price * quantity

    return {
      productName: product.name,
      quantity,
      unitPrice: product.price,
      totalPrice,
      category: product.category,
      description: product.description,
      timestamp: new Date().toISOString(),
    }
  },
}
