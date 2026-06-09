import { supabase } from '@/lib/supabase'

export const getProductImageUrl = (path) => {
  if (!path) return null

  return supabase
    .storage
    .from('product-images')
    .getPublicUrl(path)
    .data.publicUrl
}