import { Button } from '@/components/ui'
import { openWhatsApp } from '@/utils/whatsapp'

export default function OrderButton({ product, producerPhone, variant = 'primary' }) {
  const disabled = product.quantity === 0 || !producerPhone

  const handleOrder = () => {
    if (disabled) return

    openWhatsApp(producerPhone, {
      productName: product.name,
      quantity: 1,
      price: product.price,
      totalPrice: product.price,
    })
  }

  return (
    <Button
      onClick={handleOrder}
      disabled={disabled}
      variant={variant}
      fullWidth
    >
      {product.quantity === 0
        ? 'Agotado'
        : !producerPhone
        ? 'Sin contacto'
        : 'Ordenar por WhatsApp'}
    </Button>
  )
}
