import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (!mobile) {
      setError('Please enter your mobile number.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'No profile found with this mobile number.');
        setLoading(false);
        return;
      }

      // Redirect to their success/QR page
      router.push(`/success/${data.id}`);
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="wrap">
      <Head>
        <title>Login — Divine Medical Help</title>
      </Head>

      <div className="topbar">
        <h1>🚨 Divine Medical Help</h1>
        <p>Login to access your emergency profile</p>
      </div>

      <div style={{ padding: '32px 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>🔑</div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 6 }}>Welcome back</h2>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6 }}>
            Enter the mobile number you registered with to access your QR code and profile.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="f-row" style={{ marginBottom: 16 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: 4 }}>
              Mobile Number (with country code)
            </label>
            <input
              type="tel"
              placeholder="+919876543210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px',
                border: '1.5px solid #e5e7eb', borderRadius: 10,
                fontFamily: 'DM Sans, sans-serif', fontSize: '1rem',
                color: '#1a1a1a', background: '#f9fafb', outline: 'none',
              }}
              autoFocus
            />
          </div>

          {error && (
            <div style={{
              background: '#fde8e9', border: '1px solid #fca5a5',
              borderRadius: 8, padding: '10px 14px',
              fontSize: '0.82rem', color: '#c1121f', marginBottom: 14,
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? '#d1d5db' : '#e63946',
              color: '#fff', border: 'none', borderRadius: 10,
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem',
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Looking up your profile…' : '🔍 Find My Profile'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 8 }}>
            Don&apos;t have an account yet?
          </p>
          <Link href="/register" style={{
            color: '#e63946', fontWeight: 600,
            fontSize: '0.88rem', textDecoration: 'none',
          }}>
            Register & Get My QR →
          </Link>
        </div>

        <div style={{
          marginTop: 28, padding: '12px 14px',
          background: '#f9fafb', border: '1px solid #e5e7eb',
          borderRadius: 10, fontSize: '0.75rem',
          color: '#9ca3af', lineHeight: 1.6, textAlign: 'center',
        }}>
          🔒 We only use your mobile number to find your profile. We never share it with anyone.
        </div>
      </div>
    </div>
  );
}
