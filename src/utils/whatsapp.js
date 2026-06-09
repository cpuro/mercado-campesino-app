/**
 * Genera un enlace de WhatsApp con el mensaje automático del pedido
 * @param {string} producerPhone - Número de teléfono del productor
 * @param {object} order - Objeto con datos del pedido
 * @param {object} consumer - Objeto con datos del consumidor (email, name, phone)
 * @returns {string} URL para redireccionar a WhatsApp
 */
export const generateWhatsAppLink = (producerPhone, order, consumer = {}) => {
  const { productName, quantity, price, totalPrice } = order
  const { email, name, phone } = consumer
  
  let message = `Hola, quiero pedir:\n\n`
  
  // Agregar información del consumidor si está disponible
  if (email || name || phone) {
    message += `*DATOS DEL COMPRADOR*\n`
    if (name) message += `Nombre: ${name}\n`
    if (email) message += `Email: ${email}\n`
    if (phone) message += `Celular: ${phone}\n`
    message += `\n`
  }
  
  // Agregar información del pedido
  message += ` *DETALLES DEL PEDIDO*\n`
  message += `Producto: ${productName}\n`
  message += `Cantidad: ${quantity}\n`
  message += `Precio unitario: $${price}\n`
  message += `Total: $${totalPrice}`
  
  // Codificar el mensaje para URL
  const encodedMessage = encodeURIComponent(message)
  
  // Formato: https://wa.me/XXXXXXXXXXXXX?text=mensaje
  // El número debe estar sin caracteres especiales
  const cleanPhone = producerPhone.replace(/\D/g, '')
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

/**
 * Abre WhatsApp en desktop o móvil dependiendo del dispositivo
 */
export const openWhatsApp = (producerPhone, order, consumer) => {
  const link = generateWhatsAppLink(producerPhone, order, consumer)
  window.open(link, '_blank')
}
