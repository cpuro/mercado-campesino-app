import ProductCard from './ProductCard'
import { Spinner } from '@/components/ui'

export default function ProductGrid({ products, loading, onOrder, producerPhones }) {
  if (loading) {
    return <Spinner size="lg" className="py-12" />
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">No se encontraron productos</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onOrder={onOrder}
          producerPhone={producerPhones?.[product.producer_id]}
        />
      ))}
    </div>
  )
}
