import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ejpdprqfpoygoppkpznb.supabase.co'
const supabaseKey = 'sb_publishable_Zh604I-XCgW9saZQz8Dddg_nDO5Zh5a'

export const supabase = createClient(supabaseUrl, supabaseKey)
