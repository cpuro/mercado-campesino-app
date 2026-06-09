import { Badge } from '@/components/ui'
import { getProductImageUrl } from '@/utils/storage'

export default function ProductImage({ product, className = '' }) {
  const hasImage = product.image_path
  const imageUrl = hasImage ? getProductImageUrl(product.image_path) : null

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={product.name}
        className={`object-cover rounded-lg ${className}`}
      />
    )
  }

  return (
    <div className={`bg-gray-200 flex items-center justify-center text-gray-400 text-6xl rounded-lg ${className}`}>
      🖼️
    </div>
  )
}
