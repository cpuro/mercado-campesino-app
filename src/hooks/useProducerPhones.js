import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * Hook para obtener teléfonos de productores
 * @param { string[] } producerIds - Array de IDs de productores
 * @returns { phonesMap, loading, error }
 */
export function useProducerPhones(producerIds = []) {
  const [phonesMap, setPhonesMap] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!producerIds || producerIds.length === 0) return

    const fetchPhones = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error: dbError } = await supabase
          .from('users')
          .select('id, phone')
          .in('id', producerIds)

        if (dbError) throw dbError

        const map = {}
        data?.forEach(user => {
          if (user.phone) {
            map[user.id] = user.phone
          }
        })
        setPhonesMap(map)
      } catch (err) {
        console.error('Error fetching producer phones:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPhones()
  }, [producerIds])

  return { phonesMap, loading, error }
}
