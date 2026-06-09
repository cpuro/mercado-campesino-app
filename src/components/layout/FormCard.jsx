import { Card } from '@/components/ui'

export default function FormCard({ title, description, children }) {
  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Mercado Campesino</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      {children}
    </Card>
  )
}
