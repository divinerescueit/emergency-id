import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const initialState = {
  name: '', age: '', gender: '', mobile: '',
  blood: '', donor: 'No', allergies: '', conditions: '', meds: '',
  privacy: 'public',
  c1name: '', c1rel: '', c1phone: '',
  c2name: '', c2rel: '', c2phone: '',
};

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.age || !form.gender || !form.blood || !form.mobile || !form.c1name || !form.c1phone) {
      setError('Please fill all required fields (*) before continuing.');
      return;
    }
    setError('');
    setSubmitting(true);

    const contacts = [
      { name: form.c1name, relation: form.c1rel || 'Emergency Contact', phone: form.c1phone, primary: true },
    ];
    if (form.c2name && form.c2phone) {
      contacts.push({ name: form.c2name, relation: form.c2rel || 'Emergency Contact', phone: form.c2phone, primary: false });
    }

    const payload = {
      name: form.name, age: form.age, gender: form.gender, mobile: form.mobile,
      blood: form.blood, donor: form.donor, allergies: form.allergies,
      conditions: form.conditions, meds: form.meds, privacy: form.privacy, contacts,
    };

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      router.push(`/success/${data.id}`);
    } catch (err) {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="wrap">
      <Head>
        <title>Register — Divine Medical Help</title>
      </Head>

      <div className="topbar">
        <h1>🚨 Divine Medical Help</h1>
        <p>Register once. Get a QR that can save your life.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-wrap">

          <div className="f-section">
            <h3>Personal Details</h3>
            <div className="f-row">
              <label>Full Name *</label>
              <input type="text" placeholder="e.g. Rahul Sharma" value={form.name} onChange={(e) => update('name', e.target.value)} />
            </div>
            <div className="f-row">
              <label>Mobile Number * <span style={{ fontWeight: 400, color: '#9ca3af' }}>(for future login)</span></label>
              <input type="tel" placeholder="+919876543210" value={form.mobile} onChange={(e) => update('mobile', e.target.value)} />
            </div>
            <div className="f-grid2">
              <div className="f-row">
                <label>Age *</label>
                <input type="number" placeholder="32" value={form.age} onChange={(e) => update('age', e.target.value)} />
              </div>
              <div className="f-row">
                <label>Gender *</label>
                <select value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="f-section">
            <h3>Medical Information</h3>
            <div className="f-grid2">
              <div className="f-row">
                <label>Blood Group *</label>
                <select value={form.blood} onChange={(e) => update('blood', e.target.value)}>
                  <option value="">Select</option>
                  <option>A+</option><option>A-</option>
                  <option>B+</option><option>B-</option>
                  <option>AB+</option><option>AB-</option>
                  <option>O+</option><option>O-</option>
                </select>
              </div>
              <div className="f-row">
                <label>Organ Donor</label>
                <select value={form.donor} onChange={(e) => update('donor', e.target.value)}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
            <div className="f-row">
              <label>Known Allergies</label>
              <input type="text" placeholder="e.g. Penicillin, Peanuts" value={form.allergies} onChange={(e) => update('allergies', e.target.value)} />
            </div>
            <div className="f-row">
              <label>Existing Medical Conditions</label>
              <textarea placeholder="e.g. Type 2 Diabetes, Asthma" value={form.conditions} onChange={(e) => update('conditions', e.target.value)} />
            </div>
            <div className="f-row">
              <label>Current Medications</label>
              <textarea placeholder="e.g. Metformin 500mg twice daily" value={form.meds} onChange={(e) => update('meds', e.target.value)} />
            </div>
          </div>

          <div className="f-section">
            <h3>Primary Emergency Contact</h3>
            <div className="contact-block">
              <div className="f-grid2">
                <div className="f-row">
                  <label>Name *</label>
                  <input type="text" placeholder="John Doe" value={form.c1name} onChange={(e) => update('c1name', e.target.value)} />
                </div>
                <div className="f-row">
                  <label>Relation</label>
                  <input type="text" placeholder="Father" value={form.c1rel} onChange={(e) => update('c1rel', e.target.value)} />
                </div>
              </div>
              <div className="f-row">
                <label>Phone (with country code) *</label>
                <input type="tel" placeholder="+919876543210" value={form.c1phone} onChange={(e) => update('c1phone', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="f-section">
            <h3>Secondary Emergency Contact (optional)</h3>
            <div className="contact-block">
              <div className="f-grid2">
                <div className="f-row">
                  <label>Name</label>
                  <input type="text" placeholder="Priya Doe" value={form.c2name} onChange={(e) => update('c2name', e.target.value)} />
                </div>
                <div className="f-row">
                  <label>Relation</label>
                  <input type="text" placeholder="Mother" value={form.c2rel} onChange={(e) => update('c2rel', e.target.value)} />
                </div>
              </div>
              <div className="f-row">
                <label>Phone (with country code)</label>
                <input type="tel" placeholder="+919876543211" value={form.c2phone} onChange={(e) => update('c2phone', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="f-section">
            <h3>Privacy Mode</h3>
            <div className="f-row">
              <select value={form.privacy} onChange={(e) => update('privacy', e.target.value)}>
                <option value="public">Public — show all details</option>
                <option value="limited">Limited — name, blood group & contacts only</option>
                <option value="medical">Medical Only — medical info & contacts only</option>
                <option value="hidden">Hidden — notify contacts only, no details shown</option>
              </select>
            </div>
          </div>

          {error && <div className="err">{error}</div>}
        </div>

        <div className="bottom-bar">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Creating your profile…' : 'Register & Generate QR'}
          </button>
        </div>
      </form>
    </div>
  );
}
