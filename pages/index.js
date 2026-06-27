import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="wrap">
      <Head><title>Divine Medical Help — Be Found. Be Safe.</title></Head>
      <div className="topbar">
        <h1>🚨 Divine Medical Help</h1>
        <p>divinerescue.in — A QR code that can save your life.</p>
      </div>
      <div className="landing-body">
        <h2>Register once. Carry one QR.</h2>
        <p>Create a free emergency profile with your medical details and emergency contacts. Print your QR sticker and stick it on your phone, helmet, bike, or wallet. Anyone who scans it instantly sees how to help you.</p>
        <ul className="feature-list">
          <li>🩸 Blood group, allergies & medical conditions</li>
          <li>📞 One-tap call, SMS & WhatsApp to your contacts</li>
          <li>🗺️ Nearby hospital, police & ambulance links</li>
          <li>📍 Live location tracking once scanned</li>
          <li>🔒 Choose what's visible: public, limited, medical-only or hidden</li>
        </ul>
        <Link href="/register" className="btn-solid-red" style={{ display: 'block', textAlign: 'center', marginBottom: 12 }}>
          Register & Get My QR →
        </Link>
        <Link href="/login" style={{
          display: 'block', textAlign: 'center', padding: '13px', borderRadius: '50px',
          border: '1.5px solid #e5e7eb', background: '#fff', color: '#1a1a1a',
          fontFamily: 'DM Sans, sans-serif', fontSize: '0.92rem', fontWeight: 600,
          textDecoration: 'none', marginBottom: 20,
        }}>
          🔑 Login to My Account
        </Link>
        <p style={{ fontSize: '0.72rem', color: '#9ca3af', textAlign: 'center', lineHeight: 1.6 }}>
          ⚠️ Disclaimer: This QR code is intended only for medical emergency assistance. It does not replace professional medical care or emergency services. Users are responsible for ensuring that the information provided is accurate and up to date.
        </p>
      </div>
    </div>
  );
}
