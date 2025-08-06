import React, { useState } from 'react';
import { createUser } from '../../utils/api';

const roles = [
  { label: 'Student', value: 'student' },
  { label: 'Admin', value: 'admin' },
  { label: 'Faculty', value: 'faculty' },
];

export default function AddUser() {
  const [form, setForm] = useState({
    mobile: '',
    name: '',
    role: 'student',
    college_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await createUser({
        ...form,
        college_id: Number(form.college_id),
      });
      setResult(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Mobile:</label>
          <input name="mobile" value={form.mobile} onChange={handleChange} required />
        </div>
        <div>
          <label>Name:</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Role:</label>
          <select name="role" value={form.role} onChange={handleChange} required>
            {roles.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label>College ID:</label>
          <input name="college_id" value={form.college_id} onChange={handleChange} required type="number" />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 16, background: '#f6f6f6', padding: 12, borderRadius: 6 }}>
          <h4>User Created:</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}