/**
 * Validation Service
 * 
 * Centraliza todas las validaciones del proyecto
 * Facilita mantener y reutilizar reglas de validación
 * 
 * Responsabilidades:
 * - Validar formularios
 * - Validar datos de entrada
 * - Mantener reglas de negocio
 */

class ValidationService {
  /**
   * Valida un email
   * @param {string} email 
   * @returns {{valid: boolean, error: string}}
   */
  validateEmail(email) {
    if (!email) {
      return { valid: false, error: 'El email es obligatorio' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'El formato del email no es válido' }
    }

    return { valid: true }
  }

  /**
   * Valida una contraseña
   * @param {string} password 
   * @returns {{valid: boolean, error: string}}
   */
  validatePassword(password) {
    if (!password) {
      return { valid: false, error: 'La contraseña es obligatoria' }
    }

    if (password.length < 8) {
      return { valid: false, error: 'La contraseña debe tener al menos 8 caracteres' }
    }

    // Opcional: requerir mayúsculas y números
    // if (!/[A-Z]/.test(password)) {
    //   return { valid: false, error: 'La contraseña debe contener mayúsculas' }
    // }

    return { valid: true }
  }

  /**
   * Valida que las contraseñas coincidan
   * @param {string} password 
   * @param {string} confirmPassword 
   * @returns {{valid: boolean, error: string}}
   */
  validatePasswordMatch(password, confirmPassword) {
    if (password !== confirmPassword) {
      return { valid: false, error: 'Las contraseñas no coinciden' }
    }

    return { valid: true }
  }

  /**
   * Valida datos de un producto
   * @param {Object} product 
   * @returns {{valid: boolean, error: string}}
   */
  validateProduct(product) {
    const { name, price, quantity, category } = product

    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'El nombre del producto es obligatorio' }
    }

    if (name.length > 100) {
      return { valid: false, error: 'El nombre no puede superar 100 caracteres' }
    }

    if (!price || isNaN(price) || price <= 0) {
      return { valid: false, error: 'El precio debe ser un número mayor a 0' }
    }

    if (!quantity || isNaN(quantity) || quantity < 0) {
      return { valid: false, error: 'La cantidad debe ser un número válido' }
    }

    if (!category || category.trim().length === 0) {
      return { valid: false, error: 'La categoría es obligatoria' }
    }

    return { valid: true }
  }

  /**
   * Valida un número de teléfono
   * @param {string} phone 
   * @returns {{valid: boolean, error: string}}
   */
  validatePhone(phone) {
    if (!phone) {
      return { valid: false, error: 'El teléfono es obligatorio' }
    }

    // Aceptar números con formato o sin formato
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (!phoneRegex.test(phone)) {
      return { valid: false, error: 'El formato del teléfono no es válido' }
    }

    return { valid: true }
  }

  /**
   * Valida un formulario completo
   * @param {Object} data - Datos del formulario
   * @param {Object} rules - Reglas de validación
   * @returns {{valid: boolean, errors: Object}}
   * 
   * Ejemplo de uso:
   * const rules = {
   *   email: 'email',
   *   password: 'password',
   *   name: 'required|max:50'
   * }
   */
  validateForm(data, rules) {
    const errors = {}

    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field]
      const ruleArray = rule.split('|')

      for (const singleRule of ruleArray) {
        let error = null

        if (singleRule === 'email') {
          const result = this.validateEmail(value)
          if (!result.valid) error = result.error
        } else if (singleRule === 'password') {
          const result = this.validatePassword(value)
          if (!result.valid) error = result.error
        } else if (singleRule === 'required') {
          if (!value || value.toString().trim().length === 0) {
            error = `${field} es obligatorio`
          }
        } else if (singleRule.startsWith('max:')) {
          const max = parseInt(singleRule.split(':')[1])
          if (value && value.length > max) {
            error = `${field} no puede superar ${max} caracteres`
          }
        } else if (singleRule.startsWith('min:')) {
          const min = parseInt(singleRule.split(':')[1])
          if (value && value.length < min) {
            error = `${field} debe tener al menos ${min} caracteres`
          }
        }

        if (error) {
          errors[field] = error
          break // Parar en el primer error para este campo
        }
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    }
  }
}

export const validationService = new ValidationService()
