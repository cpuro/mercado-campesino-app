import { useState } from 'react'
import { Button, Input, Select, Alert } from '@/components/ui'

export default function RegisterForm({ onSubmit, error, loading }) {
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden')
      return
    }

    setLocalError('')
    onSubmit({
      email: formData.get('email'),
      password,
      role: formData.get('role'),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || localError) && (
        <Alert type="error" message={error || localError} />
      )}

      <Select
        label="¿Eres?"
        name="role"
        defaultValue="consumer"
        options={[
          { value: 'consumer', label: 'Consumidor (Quiero comprar)' },
          { value: 'producer', label: 'Productor (Quiero vender)' },
        ]}
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="tu@email.com"
        required
      />

      <Input
        label="Contraseña"
        type="password"
        name="password"
        placeholder="••••••••"
        required
      />

      <Input
        label="Confirmar contraseña"
        type="password"
        name="confirmPassword"
        placeholder="••••••••"
        required
      />

      <Button type="submit" fullWidth loading={loading}>
        {loading ? 'Registrando...' : 'Crear cuenta'}
      </Button>
    </form>
  )
}
