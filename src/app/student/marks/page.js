'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepProgress from '@/components/StepProgress';
import LoadingSpinner from '@/components/LoadingSpinner';

const BRANCHES = [
  { code: 'CSE', name: 'Computer Science Engineering' },
  { code: 'ECE', name: 'Electronics & Communication Engineering' },
  { code: 'ME', name: 'Mechanical Engineering' },
  { code: 'CE', name: 'Civil Engineering' },
  { code: 'EE', name: 'Electrical Engineering' },
  { code: 'IT', name: 'Information Technology' },
];

export default function MarksPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    mathHs: '', scienceHs: '', englishHs: '', hindiHs: '',
    physics: '', chemistry: '', math12: '',
    branchChoice1: '', branchChoice2: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMarks() {
      try {
        const res = await fetch('/api/student/marks');
        if (res.ok) {
          const data = await res.json();
          const student = data.student;
          setFormData({
            mathHs: student.mathHs !== null ? student.mathHs : '',
            scienceHs: student.scienceHs !== null ? student.scienceHs : '',
            englishHs: student.englishHs !== null ? student.englishHs : '',
            hindiHs: student.hindiHs !== null ? student.hindiHs : '',
            physics: student.physics !== null ? student.physics : '',
            chemistry: student.chemistry !== null ? student.chemistry : '',
            math12: student.math12 !== null ? student.math12 : '',
            branchChoice1: student.branchChoice1 || '',
            branchChoice2: student.branchChoice2 || '',
          });
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred loading academic details.');
      } finally {
        setLoading(false);
      }
    }
    loadMarks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check branch selection matching
    if (formData.branchChoice1 === formData.branchChoice2) {
      setError('First and Second preferences must be different.');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/student/marks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit marks.');
        setSaving(false);
      } else {
        router.push('/student/branch-status');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred submitting details.');
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving academic grades and choices..." />;
  }

  return (
    <div className="marks-page-container animate-slide-up">
      <StepProgress currentStep={2} />

      <div className="glass-card form-card-wrapper">
        <div className="form-card-header">
          <h2>Step 2: Academic Marks & Choices</h2>
          <p>Please enter your scores out of 100 and select your engineering stream preferences.</p>
        </div>

        {error && (
          <div className="badge badge-danger w-full-alert" style={{ width: '100%', padding: '12px', borderRadius: '8px', marginBottom: '16px', display: 'block', textTransform: 'none', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* High school marks */}
          <h3 className="section-title">1. High School (10th) Subject Grades</h3>
          <div className="grid-cols-4">
            <div className="form-group">
              <label className="form-label" htmlFor="marks-mathHs">Mathematics</label>
              <input
                type="number"
                id="marks-mathHs"
                className="form-control"
                min="0" max="100" placeholder="0-100"
                value={formData.mathHs}
                onChange={(e) => setFormData({ ...formData, mathHs: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="marks-scienceHs">Science</label>
              <input
                type="number"
                id="marks-scienceHs"
                className="form-control"
                min="0" max="100" placeholder="0-100"
                value={formData.scienceHs}
                onChange={(e) => setFormData({ ...formData, scienceHs: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="marks-englishHs">English</label>
              <input
                type="number"
                id="marks-englishHs"
                className="form-control"
                min="0" max="100" placeholder="0-100"
                value={formData.englishHs}
                onChange={(e) => setFormData({ ...formData, englishHs: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="marks-hindiHs">Hindi</label>
              <input
                type="number"
                id="marks-hindiHs"
                className="form-control"
                min="0" max="100" placeholder="0-100"
                value={formData.hindiHs}
                onChange={(e) => setFormData({ ...formData, hindiHs: e.target.value })}
                required
              />
            </div>
          </div>

          {/* 10+2 marks */}
          <h3 className="section-title" style={{ marginTop: '24px' }}>2. 10+2 / Intermediate Subject Grades</h3>
          <div className="grid-cols-3">
            <div className="form-group">
              <label className="form-label" htmlFor="marks-physics">Physics</label>
              <input
                type="number"
                id="marks-physics"
                className="form-control"
                min="0" max="100" placeholder="0-100"
                value={formData.physics}
                onChange={(e) => setFormData({ ...formData, physics: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="marks-chemistry">Chemistry</label>
              <input
                type="number"
                id="marks-chemistry"
                className="form-control"
                min="0" max="100" placeholder="0-100"
                value={formData.chemistry}
                onChange={(e) => setFormData({ ...formData, chemistry: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="marks-math12">Mathematics</label>
              <input
                type="number"
                id="marks-math12"
                className="form-control"
                min="0" max="100" placeholder="0-100"
                value={formData.math12}
                onChange={(e) => setFormData({ ...formData, math12: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Branch choices */}
          <h3 className="section-title" style={{ marginTop: '24px' }}>3. Branch Preferences</h3>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label" htmlFor="pref-branch1">First Branch Choice</label>
              <select
                id="pref-branch1"
                className="form-control"
                value={formData.branchChoice1}
                onChange={(e) => setFormData({ ...formData, branchChoice1: e.target.value })}
                required
              >
                <option value="">-- Choose Branch --</option>
                {BRANCHES.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pref-branch2">Second Branch Choice</label>
              <select
                id="pref-branch2"
                className="form-control"
                value={formData.branchChoice2}
                onChange={(e) => setFormData({ ...formData, branchChoice2: e.target.value })}
                required
              >
                <option value="">-- Choose Branch --</option>
                {BRANCHES.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions-row">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Submit Academic Profile'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .form-card-wrapper {
          padding: 30px;
        }
        .form-card-header {
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
        }
        .form-card-header h2 {
          font-size: 1.4rem;
          margin-bottom: 4px;
          color: var(--primary);
        }
        .form-card-header p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .section-title {
          font-size: 1.05rem;
          margin-bottom: 16px;
          color: var(--text-primary);
          border-bottom: 1px solid rgba(255,255,255,0.03);
          padding-bottom: 8px;
        }
        .form-actions-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 30px;
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
        }
      `}</style>
    </div>
  );
}
