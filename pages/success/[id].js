import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const STICKER_TYPES = [
  { id: 'phone-back', label: '📱 Phone Back', size: '6 x 9 cm', desc: 'Stick on back of your phone' },
  { id: 'helmet', label: '🪖 Helmet', size: '7 x 10 cm', desc: 'Inside or outside of helmet' },
  { id: 'wallet', label: '👛 Wallet / ID Card', size: '5 x 7 cm', desc: 'Fits inside wallet or on ID card' },
  { id: 'bag', label: '🎒 Bag / Backpack', size: '8 x 11 cm', desc: 'Stick on your bag or backpack' },
  { id: 'bike', label: '🏍️ Bike / Vehicle', size: '10 x 13 cm', desc: 'On bike, car, or vehicle' },
  { id: 'wristband', label: '🩹 Wristband / ID Band', size: '3 x 4 cm', desc: 'Small wristband or ID band' },
  { id: 'custom', label: '✏️ Custom Size', size: 'Custom', desc: 'Enter your own size' },
];

export default function Success() {
  const router = useRouter();
  const { id } = router.query;
  const [siteUrl, setSiteUrl] = useState('');
  const [step, setStep] = useState('choose'); // 'choose' | 'preview'
  const [selected, setSelected] = useState(null);
  const [customW, setCustomW] = useState('');
  const [customH, setCustomH] = useState('');
  const printRef = useRef(null);

  useEffect(() => {
    setSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin);
  }, []);

  if (!id) return <div className="loading-page">Loading…</div>;

  const emergencyUrl = siteUrl ? `${siteUrl}/e/${id}` : '';
  const qrSrc = emergencyUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(emergencyUrl)}&color=e63946&bgcolor=ffffff&qzone=2`
    : '';

  function getSizeLabel() {
    if (!selected) return '';
    if (selected.id === 'custom') return `${customW || '?'} x ${customH || '?'} cm`;
    return selected.size;
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="wrap">
      <Head>
        <title>Your QR Code — Divine Medical Help</title>
        <style>{`
          @media print {
            body * { visibility: hidden !important; }
            #print-area, #print-area * { visibility: visible !important; }
            #print-area {
              position: fixed !important;
              top: 0; left: 0;
              width: 100vw; height: 100vh;
              display: flex !important;
              align-items: center;
              justify-content: center;
              background: white !important;
            }
          }
        `}</style>
      </Head>

      {/* Hidden print area */}
      <div id="print-area" ref={printRef} style={{ display: 'none' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: 16, background: '#fff',
          border: '2px dashed #e63946', borderRadius: 12,
          width: selected?.id === 'custom' ? `${(parseFloat(customW)||6)*37.8}px` : undefined,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#e63946', marginBottom: 4, textTransform: 'uppercase' }}>
            🚨 Divine Medical Help
          </div>
          {qrSrc && <img src={qrSrc} style={{ width: 160, height: 160 }} alt="QR" />}
          <div style={{ fontSize: 9, color: '#6b7280', marginTop: 4, textAlign: 'center' }}>
            divinerescue.in
          </div>
          <div style={{ fontSize: 8, color: '#9ca3af', marginTop: 2, textAlign: 'center' }}>
            Scan in emergency
          </div>
        </div>
      </div>

      <div className="qr-view-inner">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: '1.8rem' }}>🚨</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginTop: 4 }}>Divine Medical Help</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: 3 }}>divinerescue.in</p>
        </div>

        {step === 'choose' && (
          <>
            <div style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 14, padding: '14px 16px', width: '100%', maxWidth: 360, marginBottom: 16,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>
                Step 1 — Choose where to paste your sticker
              </div>
              {STICKER_TYPES.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelected(s)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 10, marginBottom: 6,
                    background: selected?.id === s.id ? 'rgba(230,57,70,0.25)' : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${selected?.id === s.id ? '#e63946' : 'rgba(255,255,255,0.08)'}`,
                    cursor: 'pointer', transition: 'all .15s',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>{s.label}</div>
                    <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>{s.desc}</div>
                  </div>
                  <div style={{
                    fontSize: '0.72rem', fontWeight: 700, color: selected?.id === s.id ? '#ff8a8a' : 'rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: 20, flexShrink: 0,
                  }}>
                    {s.size}
                  </div>
                </div>
              ))}

              {selected?.id === 'custom' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Width (cm)</div>
                    <input
                      type="number" placeholder="e.g. 6" value={customW}
                      onChange={(e) => setCustomW(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Height (cm)</div>
                    <input
                      type="number" placeholder="e.g. 9" value={customH}
                      onChange={(e) => setCustomH(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              className="btn-solid-red"
              disabled={!selected || (selected.id === 'custom' && (!customW || !customH))}
              onClick={() => setStep('preview')}
              style={{ width: '100%', maxWidth: 360, opacity: (!selected || (selected.id === 'custom' && (!customW || !customH))) ? 0.4 : 1 }}
            >
              Next — Preview My QR →
            </button>
          </>
        )}

        {step === 'preview' && (
          <>
            {/* QR Preview */}
            <div style={{ marginBottom: 6, textAlign: 'center' }}>
              <div style={{
                display: 'inline-block',
                background: '#fff', borderRadius: 16, padding: '16px 20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                border: '3px solid #e63946',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: 1.2, color: '#e63946', marginBottom: 6, textTransform: 'uppercase' }}>
                  🚨 Divine Medical Help
                </div>
                {qrSrc && <img src={qrSrc} alt="QR Code" width={200} height={200} style={{ display: 'block' }} />}
                <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: 6, fontWeight: 500 }}>
                  divinerescue.in
                </div>
                <div style={{ fontSize: '0.65rem', color: '#9ca3af', marginTop: 2 }}>
                  Scan in emergency
                </div>
              </div>
            </div>

            {/* Size badge */}
            <div style={{
              background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)',
              borderRadius: 20, padding: '5px 14px', marginBottom: 16,
              fontSize: '0.78rem', color: '#ff8a8a', fontWeight: 600,
            }}>
              📐 Size: {getSizeLabel()} — {selected?.label}
            </div>

            {/* Disclaimer */}
            <div style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 20,
              maxWidth: 340, textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                ⚠️ <strong style={{ color: 'rgba(255,255,255,0.5)' }}>Disclaimer:</strong> This QR code is intended only for medical emergency assistance. It does not replace professional medical care or emergency services.
              </div>
            </div>

            {/* Actions */}
            <div className="qr-actions" style={{ width: '100%', maxWidth: 340 }}>
              <button className="btn-solid-red" onClick={handlePrint}>
                🖨️ Print / Save as PDF
              </button>
              {qrSrc && (
                <a
                  className="btn-outline"
                  href={qrSrc}
                  download={`divine-medical-qr-${id}.png`}
                  target="_blank"
                  rel="noreferrer"
                >
                  ⬇️ Download QR Image
                </a>
              )}
              {emergencyUrl && (
                <a className="btn-outline" href={`/e/${id}`} target="_blank" rel="noreferrer">
                  📱 View My Emergency Page
                </a>
              )}
              <button className="btn-outline" onClick={() => setStep('choose')}>
                ← Change Size / Sticker Type
              </button>
              <Link href="/register" className="btn-outline">
                + Register Another Person
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
