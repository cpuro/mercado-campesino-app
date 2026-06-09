import { useMemo } from 'react'

/**
 * Hook para filtrar productos por búsqueda y categoría
 * @param { Object[] } products - Array de productos
 * @param { string } searchTerm - Término de búsqueda
 * @param { string } categoryFilter - Categoría a filtrar
 * @returns { filtered }
 */
export function useProductFilter(products = [], searchTerm = '', categoryFilter = '') {
  const filtered = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory =
        !categoryFilter || product.category === categoryFilter

      const isAvailable = product.quantity > 0

      return matchesSearch && matchesCategory && isAvailable
    })
  }, [products, searchTerm, categoryFilter])

  return filtered
}
