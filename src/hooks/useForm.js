import { useState } from 'react'

/**
 * Hook para manejar formularios genéricos
 * @param { Object } initialValues - Valores iniciales del formulario
 * @param { Function } onSubmit - Función a ejecutar al enviar
 * @returns { formData, setFormData, handleChange, handleSubmit, loading, error }
 */
export function useForm(initialValues = {}, onSubmit) {
  const [formData, setFormData] = useState(initialValues)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err.message || 'Error al procesar el formulario')
      console.error('Form error:', err)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFormData(initialValues)
    setError('')
  }

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    loading,
    error,
    setError,
    reset,
  }
}
