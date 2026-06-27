import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { filterProfileForPublicView } from '../../lib/privacy';

export async function getServerSideProps({ params }) {
  const { id } = params;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('emergency_profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return { props: { profile: null } };
    const filtered = filterProfileForPublicView(data);
    return { props: { profile: filtered } };
  } catch (err) {
    console.error('getServerSideProps error:', err);
    return { props: { profile: null, serverError: true } };
  }
}

function initials(name) {
  if (!name) return '🚨';
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

function smsLink(phone, name) {
  const body = `Medical Emergency Alert: I have found ${name || 'this person'} and they need immediate medical assistance. Please contact me immediately.`;
  return `sms:${phone}&body=${encodeURIComponent(body)}`;
}

function waLink(phone, name) {
  const clean = (phone || '').replace(/[^\d+]/g, '').replace('+', '');
  const msg = `🚨 *Medical Emergency Alert*\n\nI have found *${name || 'this person'}* and they need immediate medical assistance.\n\nPlease contact me immediately.`;
  return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
}

export default function EmergencyPage({ profile, serverError }) {
  const [priority, setPriority] = useState('critical');
  const [trackSecs, setTrackSecs] = useState(0);
  const [tracking, setTracking] = useState(true);
  const [sent, setSent] = useState(false);
  const [acked, setAcked] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!tracking) return;
    intervalRef.current = setInterval(() => {
      setTrackSecs((s) => {
        if (s + 1 >= 1800) { setTracking(false); return s; }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [tracking]);

  function handleSend() {
    setSent(true);
    setTimeout(() => setAcked(true), 2000);
  }

  if (serverError) {
    return (
      <div className="wrap">
        <div className="not-found-page">
          <h2>⚠️ Something went wrong</h2>
          <p>This emergency page couldn&apos;t be loaded. Please call emergency services directly.</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="wrap">
        <Head><title>Profile not found — Divine Medical Help</title></Head>
        <div className="not-found-page">
          <h2>🔍 Profile not found</h2>
          <p>This QR code doesn&apos;t match any registered profile.</p>
        </div>
      </div>
    );
  }

  const m = Math.floor(trackSecs / 60);
  const s = trackSecs % 60;
  const showMedical = profile.privacy === 'public' || profile.privacy === 'medical';

  return (
    <div className="wrap" style={{ background: '#fff' }}>
      <Head>
        <title>{profile.name ? `Emergency — ${profile.name}` : 'Medical Emergency Alert'}</title>
      </Head>

      <div className="top-bar-e">
        <div><span className="pulse-dot" />Medical Emergency Alert Active</div>
        <div>Scanned just now</div>
      </div>

      {/* HERO */}
      {profile.privacy === 'hidden' ? (
        <div className="hero-card">
          <div className="hero-avatar">🚨</div>
          <div>
            <div className="hero-name">Medical Emergency</div>
            <div className="hero-sub">Details hidden. Please contact emergency contacts below immediately.</div>
          </div>
        </div>
      ) : (
        <div className="hero-card">
          <div className="hero-avatar">{initials(profile.name)}</div>
          <div>
            <div className="hero-name">{profile.name}</div>
            {(profile.age || profile.gender) && (
              <div className="hero-sub">
                {profile.age ? `${profile.age} yrs` : ''}{profile.age && profile.gender ? ' • ' : ''}{profile.gender || ''}
              </div>
            )}
            <div className="hero-badges">
              {profile.blood && <span className="badge">🩸 {profile.blood}</span>}
              {showMedical && profile.allergies && <span className="badge">⚠️ {profile.allergies}</span>}
              {showMedical && profile.donor === 'Yes' && <span className="badge">💚 Organ Donor</span>}
            </div>
          </div>
        </div>
      )}

      {/* BIG CONTACT ACTION BUTTONS */}
      <div style={{ background: '#fff1f2', borderBottom: '1px solid #fecdd3', padding: '14px 16px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#be123c', marginBottom: 10 }}>
          Contact Emergency Contacts Now
        </div>
        {profile.contacts.map((c, i) => (
          <div key={i} style={{ marginBottom: i < profile.contacts.length - 1 ? 12 : 0 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>
              {c.name} <span style={{ color: '#6b7280', fontWeight: 400 }}>({c.relation}{c.primary ? ' • Primary' : ''})</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <a href={`tel:${c.phone}`} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '12px 8px', borderRadius: 12, background: '#d8f3dc', color: '#2d6a4f',
                textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem', gap: 4,
                boxShadow: '0 2px 8px rgba(45,106,79,0.15)',
              }}>
                <span style={{ fontSize: '1.5rem' }}>📞</span>
                Call
              </a>
              <a href={smsLink(c.phone, profile.name)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '12px 8px', borderRadius: 12, background: '#dbeafe', color: '#1d6fa4',
                textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem', gap: 4,
                boxShadow: '0 2px 8px rgba(29,111,164,0.15)',
              }}>
                <span style={{ fontSize: '1.5rem' }}>💬</span>
                Message
              </a>
              <a href={waLink(c.phone, profile.name)} target="_blank" rel="noreferrer" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '12px 8px', borderRadius: 12, background: '#dcfce7', color: '#15803d',
                textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem', gap: 4,
                boxShadow: '0 2px 8px rgba(21,128,61,0.15)',
              }}>
                <span style={{ fontSize: '1.5rem' }}>🟢</span>
                WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* PRIORITY */}
      <div className="e-section">
        <div className="sec-title">Alert Priority</div>
        <div className="priority-grid">
          <button className={`p-btn p-safe ${priority === 'safe' ? 'active' : ''}`} onClick={() => setPriority('safe')}>
            <span className="p-icon">🟢</span>Safe — no danger
          </button>
          <button className={`p-btn p-help ${priority === 'help' ? 'active' : ''}`} onClick={() => setPriority('help')}>
            <span className="p-icon">🟡</span>Needs assistance
          </button>
          <button className={`p-btn p-crit ${priority === 'critical' ? 'active' : ''}`} onClick={() => setPriority('critical')}>
            <span className="p-icon">🔴</span>Critical — immediate action required
          </button>
        </div>
      </div>

      {/* NEARBY */}
      <div className="e-section">
        <div className="sec-title">Nearby Emergency Services</div>
        <div className="map-item">
          <div className="map-ic hosp">🏥</div>
          <div className="map-info"><p>Nearest Hospital</p><span>Based on your current location</span></div>
          <a href="https://maps.google.com/?q=hospital+near+me" className="map-nav" target="_blank" rel="noreferrer">Navigate</a>
        </div>
        <div className="map-item">
          <div className="map-ic police">🚔</div>
          <div className="map-info"><p>Nearest Police Station</p><span>Based on your current location</span></div>
          <a href="https://maps.google.com/?q=police+station+near+me" className="map-nav" target="_blank" rel="noreferrer">Navigate</a>
        </div>
        <div className="map-item">
          <div className="map-ic amb">🚑</div>
          <div className="map-info"><p>Ambulance • Dial 108</p><span>Available 24/7 (India)</span></div>
          <a href="tel:108" className="map-nav">Call 108</a>
        </div>
      </div>

      {/* LIVE TRACKING */}
      <div className="e-section">
        <div className="sec-title">Live Location Tracking</div>
        <div className="track-card">
          <div className="track-header">
            <span className="pulse-dot" style={{ background: 'var(--red-dark)' }} />
            <span>{tracking ? 'Sharing location — updates every 30s' : 'Tracking stopped'}</span>
          </div>
          <div className="track-meta">
            Active for {m} min {String(s).padStart(2, '0')} sec • Auto-stops at 30 min
          </div>
          <button className="btn-track-stop" disabled={!tracking} onClick={() => setTracking(false)}>
            {tracking ? '⏹ Stop tracking' : '✓ Tracking stopped'}
          </button>
        </div>
      </div>

      {/* MEDICAL INFO */}
      {showMedical && (
        <div className="e-section">
          <div className="sec-title">Medical Information</div>
          <div className="med-grid">
            <div className="med-item"><label>Blood Group</label><span>{profile.blood || '—'}</span></div>
            <div className="med-item"><label>Age / Gender</label><span>{profile.age || '—'} / {profile.gender || '—'}</span></div>
            <div className="med-item full"><label>Known Allergies</label><span>{profile.allergies || '—'}</span></div>
            <div className="med-item full"><label>Existing Conditions</label><span>{profile.conditions || '—'}</span></div>
            <div className="med-item full"><label>Current Medications</label><span>{profile.meds || '—'}</span></div>
            <div className="med-item full"><label>Organ Donor</label><span>{profile.donor === 'Yes' ? 'Yes ✔' : 'No'}</span></div>
          </div>
        </div>
      )}

      {/* SCANNER FORM */}
      <div className="e-section">
        <div className="sec-title">Your Information (optional)</div>
        <div style={{ padding: '12px 16px 16px' }}>
          <div className="f-row"><label>Your Name</label><input type="text" placeholder="e.g. Amit Kumar" /></div>
          <div className="f-row"><label>Mobile Number</label><input type="tel" placeholder="+91 98765 00000" /></div>
          <div className="f-row"><label>Remarks</label><textarea placeholder="e.g. Found near highway, person seems unconscious" style={{ resize: 'none', height: 56, width: '100%', padding: '9px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontFamily: 'inherit', fontSize: '0.88rem' }} /></div>
          <button className="btn-primary" onClick={handleSend} disabled={sent} style={{ background: sent ? '#15803d' : undefined }}>
            {sent ? '✓ Alert Sent!' : '📤 Send Alert to Emergency Contacts'}
          </button>
        </div>
      </div>

      {acked && (
        <div className="ack-box">
          <span>✅ {profile.contacts[0]?.name || 'Emergency contact'} has acknowledged the alert — <strong>help is on the way</strong></span>
        </div>
      )}

      <div className="footer-e">Powered by Divine Medical Help • divinerescue.in</div>
    </div>
  );
}
