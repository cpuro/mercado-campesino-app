import { Button, Input, Select } from '@/components/ui'

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  onSearch,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Input
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        size="lg"
        className="flex-1"
      />
      <Select
        options={[
          { value: '', label: 'Todas las categorías' },
          { value: 'vegetales', label: 'Vegetales' },
          { value: 'frutas', label: 'Frutas' },
          { value: 'lacteos', label: 'Lácteos' },
          { value: 'granos', label: 'Granos' },
          { value: 'otros', label: 'Otros' },
        ]}
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
      />
    </div>
  )
}
