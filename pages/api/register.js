import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import crypto from 'crypto';

function generateId() {
  return crypto.randomBytes(6).toString('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, age, gender, mobile, blood, donor, allergies, conditions, meds, privacy, contacts } = req.body || {};

  if (!name || !age || !gender || !blood) {
    return res.status(400).json({ error: 'Missing required personal/medical fields.' });
  }
  if (!mobile) {
    return res.status(400).json({ error: 'Mobile number is required.' });
  }
  if (!Array.isArray(contacts) || contacts.length === 0 || !contacts[0].name || !contacts[0].phone) {
    return res.status(400).json({ error: 'At least one emergency contact (name + phone) is required.' });
  }

  const validPrivacy = ['public', 'limited', 'medical', 'hidden'];
  const safePrivacy = validPrivacy.includes(privacy) ? privacy : 'public';
  const id = generateId();

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('emergency_profiles').insert({
      id,
      name: String(name).slice(0, 100),
      age: String(age).slice(0, 10),
      gender: String(gender).slice(0, 20),
      mobile: String(mobile).slice(0, 20),
      blood: String(blood).slice(0, 5),
      donor: donor === 'Yes' ? 'Yes' : 'No',
      allergies: String(allergies || '').slice(0, 300),
      conditions: String(conditions || '').slice(0, 500),
      meds: String(meds || '').slice(0, 500),
      privacy: safePrivacy,
      contacts: contacts.slice(0, 5).map((c) => ({
        name: String(c.name).slice(0, 80),
        relation: String(c.relation || 'Emergency Contact').slice(0, 40),
        phone: String(c.phone).slice(0, 20),
        primary: !!c.primary,
      })),
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save profile. Please try again.' });
    }

    return res.status(200).json({ id });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server configuration error.' });
  }
}
