export default function Card({ children, className = '', hoverable = false }) {
  return (
    <div className={`card ${hoverable ? 'hover:shadow-lg transition-shadow' : ''} ${className}`}>
      {children}
    </div>
  )
}
