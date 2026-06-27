import { getSupabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mobile } = req.body || {};

  if (!mobile) {
    return res.status(400).json({ error: 'Mobile number is required.' });
  }

  // Normalize: strip spaces, dashes
  const cleanMobile = String(mobile).replace(/[\s\-]/g, '').slice(0, 20);

  try {
    const supabase = getSupabaseAdmin();

    // Try to find profile by mobile number
    const { data, error } = await supabase
      .from('emergency_profiles')
      .select('id, name, mobile')
      .eq('mobile', cleanMobile)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'No profile found with this mobile number. Please register first.' });
    }

    return res.status(200).json({ id: data.id, name: data.name });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
