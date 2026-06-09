import { Button, Badge } from '@/components/ui'
import { getProductImageUrl } from '@/utils/storage'

export default function ProductCard({ product, onOrder, producerPhone }) {
  const hasImage = product.image_path
  const imageUrl = hasImage ? getProductImageUrl(product.image_path) : null

  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagen */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400 text-4xl">
          🖼️
        </div>
      )}

      {/* Contenido */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
          {product.quantity > 0 ? (
            <Badge variant="success" size="sm">Disponible</Badge>
          ) : (
            <Badge variant="danger" size="sm">Agotado</Badge>
          )}
        </div>

        {product.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">
            ${product.price.toLocaleString('es-CO')}
          </span>
          <span className="text-sm text-gray-500">
            {product.quantity} disponibles
          </span>
        </div>

        {product.category && (
          <div className="mb-4">
            <Badge variant="primary" size="sm">{product.category}</Badge>
          </div>
        )}

        <Button
          fullWidth
          disabled={product.quantity === 0 || !producerPhone}
          onClick={() => onOrder(product)}
        >
          {product.quantity === 0 ? 'Agotado' : 'Ordenar por WhatsApp'}
        </Button>
      </div>
    </div>
  )
}
