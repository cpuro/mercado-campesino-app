export default function Input({
  label,
  error,
  required = false,
  size = 'md',
  ...props
}) {
  const sizeClass = size === 'lg' ? 'py-3 text-lg' : 'py-2 text-base'

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`input-base ${sizeClass} ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
