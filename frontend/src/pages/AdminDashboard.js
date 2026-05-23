import React, { useState, useEffect, useMemo } from 'react';
import { getSubmissions, downloadFile } from '../services/submissionService';

const getParticipationBadge = (type) => {
  const map = {
    'Oral Presentation': 'badge-oral',
    'Poster Presentation': 'badge-poster',
    'Virtual Presentation': 'badge-virtual',
    'Workshop': 'badge-workshop',
    'Keynote Speaker': 'badge-keynote'
  };
  return map[type] || 'badge-oral';
};

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionFilter, setSessionFilter] = useState('');
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    getSubmissions()
      .then(res => {
        const response = res.data;
        const list = Array.isArray(response) ? response : (response.data || []);
        setSubmissions(list);
      })
      .catch((err) => setError(err.userMessage || 'Failed to load submissions. Please ensure the server is running.'))
      .finally(() => setLoading(false));
  }, []);

  const sessions = useMemo(() => {
    const all = submissions.map(s => s.sessionSuggestion).filter(Boolean);
    return [...new Set(all)].sort();
  }, [submissions]);

  const filtered = useMemo(() => {
    if (!sessionFilter) return submissions;
    return submissions.filter(s => s.sessionSuggestion === sessionFilter);
  }, [submissions, sessionFilter]);

  const aiCount = useMemo(() => submissions.filter(s => s.aiSuggestedSession).length, [submissions]);

  const handleDownload = async (id, fileName) => {
    setDownloading(id);
    try {
      const res = await downloadFile(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || `abstract-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download file.');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: 'var(--bg-page)' }}>
        <div className="text-center">
          <div className="ai-spinner mx-auto mb-3" style={{ width: '36px', height: '36px' }}></div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container-fluid px-md-5">
        {/* Header */}
        <div className="admin-header d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 fade-in">
          <div>
            <p className="section-label mb-1">Administration</p>
            <h2>Submissions Dashboard</h2>
          </div>
        </div>

        {error && <div className="alert-modern alert-modern-danger mb-4">{error}</div>}

        {/* Stat Cards */}
        <div className="row g-3 mb-4 fade-in">
          <div className="col-sm-6 col-lg-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="stat-value">{submissions.length}</div>
                  <div className="stat-label">Total Submissions</div>
                </div>
                <div className="stat-icon" style={{ background: 'rgba(37,99,235,0.1)', color: 'var(--royal)' }}>📋</div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="stat-value">{sessions.length}</div>
                  <div className="stat-label">Active Sessions</div>
                </div>
                <div className="stat-icon" style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--violet)' }}>🎯</div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="stat-value">{aiCount}</div>
                  <div className="stat-label">AI Analyzed</div>
                </div>
                <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>🤖</div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="stat-value">{filtered.length}</div>
                  <div className="stat-label">Showing</div>
                </div>
                <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>📊</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="filter-card fade-in">
          <div className="row align-items-center">
            <div className="col-md-4 col-lg-3">
              <label htmlFor="sessionFilter" className="form-label" style={{ fontSize: '0.82rem' }}>Filter by Session</label>
              <select
                id="sessionFilter"
                className="form-select"
                value={sessionFilter}
                onChange={(e) => setSessionFilter(e.target.value)}
              >
                <option value="">All Sessions</option>
                {sessions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {sessionFilter && (
              <div className="col-auto mt-3 mt-md-4">
                <button
                  className="btn btn-sm"
                  style={{ background: 'var(--bg-light)', border: '1px solid var(--border-light)', fontSize: '0.82rem' }}
                  onClick={() => setSessionFilter('')}
                >
                  ✕ Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="admin-table-card fade-in">
            <div className="text-center py-5">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📭</div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>No submissions found.</p>
            </div>
          </div>
        ) : (
          <div className="admin-table-card fade-in">
            <div className="table-responsive">
              <table className="admin-table table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Author</th>
                    <th>Abstract Title</th>
                    <th>Participation</th>
                    <th>Session</th>
                    <th>AI Suggestion</th>
                    <th className="text-center">File</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, idx) => (
                    <tr key={s.id}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>{s.presentingAuthorName}</td>
                      <td>
                        <span className="d-inline-block text-truncate" style={{ maxWidth: '220px' }} title={s.abstractTitle}>
                          {s.abstractTitle}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-participation ${getParticipationBadge(s.participationType)}`}>
                          {s.participationType}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{s.sessionSuggestion}</td>
                      <td>
                        {s.aiSuggestedSession ? (
                          <span className="badge-ai">{s.aiSuggestedSession}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                      <td className="text-center">
                        {s.abstractFilePath ? (
                          <button
                            className="btn-download"
                            onClick={() => handleDownload(s.id, s.abstractFilePath)}
                            disabled={downloading === s.id}
                          >
                            {downloading === s.id ? (
                              <span className="spinner-border spinner-border-sm"></span>
                            ) : '↓ Download'}
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>No file</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-5 pb-4">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }} className="mb-0">
            © 2026 ICAI Conference Administration Panel
          </p>
        </footer>
      </div>
    </div>
  );
}
