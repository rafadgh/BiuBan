import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabase
    .from('price_history')
    .select('price, original_price, recorded_at')
    .eq('product_id', id)
    .order('recorded_at', { ascending: true })
    .limit(90)

  if (error) {
    return NextResponse.json({ data: [] })
  }

  return NextResponse.json({ data: data ?? [] })
}
