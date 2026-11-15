/**
 * SUPABASE İNTEQRASİYA MODULU
 *
 * Canlı Supabase qoşmaq üçün:
 * 1. `npm install @supabase/supabase-js`
 * 2. `.env` faylında VITE_SUPABASE_URL və VITE_SUPABASE_ANON_KEY qeyd edin.
 * 3. `src/services/db.ts` faylındakı metodları birbaşa bu `supabase` instansiyası ilə əvəzləyin.
 */

/*
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
*/

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
};
