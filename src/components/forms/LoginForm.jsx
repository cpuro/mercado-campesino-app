import { Button, Input, Alert } from '@/components/ui'

export default function LoginForm({ onSubmit, error, loading }) {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    onSubmit({
      email: formData.get('email'),
      password: formData.get('password'),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}

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

      <Button type="submit" fullWidth loading={loading}>
        {loading ? 'Iniciando...' : 'Iniciar sesión'}
      </Button>
    </form>
  )
}
