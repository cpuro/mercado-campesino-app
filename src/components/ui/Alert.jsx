export default function Alert({ type = 'info', title, message, onClose }) {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  }

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }

  return (
    <div className={`border ${styles[type]} px-4 py-3 rounded-lg flex items-start justify-between`}>
      <div className="flex items-start gap-2">
        <span className="text-lg font-bold">{icons[type]}</span>
        <div>
          {title && <p className="font-semibold">{title}</p>}
          <p>{message}</p>
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-lg hover:opacity-70">
          ×
        </button>
      )}
    </div>
  )
}
