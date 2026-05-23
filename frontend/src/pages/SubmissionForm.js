import React, { useState } from 'react';
import FormField from '../components/FormField';
import FileUpload from '../components/FileUpload';
import PhoneInput from '../components/PhoneInput';
import { submitAbstract, analyzeAbstract } from '../services/submissionService';

const COUNTRIES = [
  'Afghanistan', 'Argentina', 'Australia', 'Bangladesh', 'Brazil', 'Canada', 'China',
  'Egypt', 'France', 'Germany', 'India', 'Indonesia', 'Iran', 'Italy', 'Japan',
  'Malaysia', 'Mexico', 'Netherlands', 'Nigeria', 'Pakistan', 'Russia', 'Saudi Arabia',
  'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Turkey',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Vietnam'
];

const PARTICIPATION_TYPES = [
  'Oral Presentation',
  'Poster Presentation',
  'Virtual Presentation',
  'Workshop',
  'Keynote Speaker'
];

const SESSIONS = [
  'Artificial Intelligence',
  'Machine Learning',
  'Data Science',
  'Cybersecurity',
  'Cloud Computing',
  'IoT',
  'Blockchain',
  'Robotics',
  'Healthcare Technology',
  'Life Sciences',
  'Sustainable Engineering'
];

const matchSession = (suggested) => {
  if (!suggested) return '';
  const lower = suggested.toLowerCase();
  return SESSIONS.find(s => s.toLowerCase() === lower) ||
    SESSIONS.find(s => lower.includes(s.toLowerCase()) || s.toLowerCase().includes(lower)) ||
    suggested;
};

const initialForm = {
  presentingAuthorName: '',
  coAuthorNames: '',
  email: '',
  country: '',
  countryCode: '',
  whatsappNumber: '',
  participationType: '',
  sessionSuggestion: '',
  aiSuggestedSession: '',
  abstractTitle: '',
  file: null
};

export default function SubmissionForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, file: 'File size must be under 5MB' }));
      return;
    }

    setForm(prev => ({ ...prev, file }));
    if (errors.file) setErrors(prev => ({ ...prev, file: '' }));

    setAnalyzing(true);
    try {
      const response = await analyzeAbstract(file);
      const resData = response.data;
      const rawSuggestion = resData.data || resData.suggestedSession || resData.sessionSuggestion;
      if (rawSuggestion) {
        const matched = matchSession(rawSuggestion);
        setForm(prev => ({
          ...prev,
          aiSuggestedSession: matched,
          sessionSuggestion: matched
        }));
        if (errors.sessionSuggestion) setErrors(prev => ({ ...prev, sessionSuggestion: '' }));
      }
    } catch (err) {
      const msg = err.userMessage || err.response?.data?.message || err.response?.data?.error || 'AI analysis unavailable. Please select a session manually.';
      setStatus({ type: 'warning', msg });
    } finally {
      setAnalyzing(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.presentingAuthorName.trim()) newErrors.presentingAuthorName = 'Presenting author name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.country) newErrors.country = 'Country is required';
    if (!form.countryCode) newErrors.countryCode = 'Country code is required';
    if (!form.whatsappNumber.trim()) newErrors.whatsappNumber = 'WhatsApp number is required';
    else if (!/^\d{7,15}$/.test(form.whatsappNumber)) newErrors.whatsappNumber = 'Enter a valid phone number (7-15 digits)';
    if (!form.participationType) newErrors.participationType = 'Participation type is required';
    if (!form.sessionSuggestion) newErrors.sessionSuggestion = 'Session suggestion is required';
    if (!form.abstractTitle.trim()) newErrors.abstractTitle = 'Abstract title is required';
    if (!form.file) newErrors.file = 'Abstract file is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setErrors({});
    if (!validate()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('presentingAuthorName', form.presentingAuthorName);
      formData.append('coAuthorNames', form.coAuthorNames);
      formData.append('email', form.email);
      formData.append('country', form.country);
      formData.append('whatsappNumber', form.countryCode + form.whatsappNumber);
      formData.append('participationType', form.participationType);
      formData.append('sessionSuggestion', form.sessionSuggestion);
      formData.append('abstractTitle', form.abstractTitle);
      formData.append('file', form.file);
      if (form.aiSuggestedSession) {
        formData.append('aiSuggestedSession', form.aiSuggestedSession);
      }

      await submitAbstract(formData);
      setStatus({ type: 'success', msg: 'Abstract submitted successfully! You will receive a confirmation email shortly.' });
      setForm(initialForm);
      const fileInput = document.getElementById('file');
      if (fileInput) fileInput.value = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const res = err.response;
      if (res?.status === 400) {
        const data = res.data;
        if (data?.errors && typeof data.errors === 'object') {
          setErrors(data.errors);
          setStatus({ type: 'danger', msg: data.message || 'Please fix the highlighted errors.' });
        } else if (Array.isArray(data)) {
          const fieldErrors = {};
          data.forEach(e => { if (e.field) fieldErrors[e.field] = e.message || e.defaultMessage; });
          setErrors(fieldErrors);
          setStatus({ type: 'danger', msg: 'Please fix the highlighted errors.' });
        } else if (typeof data === 'object' && !data.message) {
          setErrors(data);
        } else {
          setStatus({ type: 'danger', msg: data?.message || 'Validation failed. Please check your inputs.' });
        }
      } else if (res?.status === 413) {
        setStatus({ type: 'danger', msg: 'File too large. Please upload a file under 5MB.' });
      } else if (res?.status >= 500) {
        setStatus({ type: 'danger', msg: 'Server error. Please try again later.' });
      } else {
        setStatus({ type: 'danger', msg: err.userMessage || 'Submission failed. Please check your connection and try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            {/* Header */}
            <div className="form-header fade-in">
              <p className="section-label">ICAI 2026</p>
              <h2>Abstract Submission</h2>
              <p>Submit your research for the International Conference on Artificial Intelligence</p>
            </div>

            {/* Status Alert */}
            {status && (
              <div className={`alert-modern alert-modern-${status.type} mb-4 fade-in`}>
                {status.msg}
                <button
                  type="button"
                  className="btn-close float-end"
                  style={{ fontSize: '0.7rem' }}
                  onClick={() => setStatus(null)}
                ></button>
              </div>
            )}

            {/* Form Card */}
            <div className="form-card fade-in">
              <div className="card-body">
                <form onSubmit={handleSubmit} noValidate>

                  {/* Section: Author Information */}
                  <div className="form-section-title">
                    <span>👤</span> Author Information
                  </div>

                  <FormField
                    label="Presenting Author Name"
                    name="presentingAuthorName"
                    value={form.presentingAuthorName}
                    onChange={handleChange}
                    error={errors.presentingAuthorName}
                    required
                    placeholder="Dr. John Smith"
                  />

                  <FormField
                    label="Co-author Name(s)"
                    name="coAuthorNames"
                    value={form.coAuthorNames}
                    onChange={handleChange}
                    placeholder="Separate multiple names with commas"
                  />

                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                    placeholder="author@university.edu"
                  />

                  <div className="row">
                    <div className="col-md-6">
                      <FormField
                        label="Country"
                        name="country"
                        as="select"
                        value={form.country}
                        onChange={handleChange}
                        error={errors.country}
                        required
                      >
                        <option value="">Select Country</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </FormField>
                    </div>
                    <div className="col-md-6">
                      <PhoneInput
                        label="WhatsApp Number"
                        codeName="countryCode"
                        codeValue={form.countryCode}
                        numberName="whatsappNumber"
                        numberValue={form.whatsappNumber}
                        onChange={handleChange}
                        error={errors.countryCode || errors.whatsappNumber}
                        required
                      />
                    </div>
                  </div>

                  {/* Section: Abstract */}
                  <div className="form-section-title mt-4">
                    <span>📄</span> Abstract Details
                  </div>

                  <FormField
                    label="Abstract Title"
                    name="abstractTitle"
                    value={form.abstractTitle}
                    onChange={handleChange}
                    error={errors.abstractTitle}
                    required
                    placeholder="Enter the title of your abstract"
                  />

                  <FileUpload
                    label="Upload Abstract"
                    name="file"
                    onChange={handleFileChange}
                    error={errors.file}
                    required
                    accept=".pdf,.doc,.docx"
                    helpText="PDF, DOC, DOCX — Max 5MB. AI will analyze and suggest a session."
                  />

                  {/* AI Analysis */}
                  {analyzing && (
                    <div className="ai-analysis-card mb-3">
                      <div className="ai-spinner"></div>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--royal)' }}>
                          AI Analyzing Abstract...
                        </span>
                        <br />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Recommending the best session for your research
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Section: Presentation */}
                  <div className="form-section-title mt-4">
                    <span>🎯</span> Presentation Details
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <FormField
                        label="Participation Type"
                        name="participationType"
                        as="select"
                        value={form.participationType}
                        onChange={handleChange}
                        error={errors.participationType}
                        required
                      >
                        <option value="">Select Type</option>
                        {PARTICIPATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </FormField>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="sessionSuggestion" className="form-label">
                          Session Suggestion<span className="text-danger ms-1">*</span>
                        </label>
                        <select
                          id="sessionSuggestion"
                          name="sessionSuggestion"
                          className={`form-select${errors.sessionSuggestion ? ' is-invalid' : ''}`}
                          value={form.sessionSuggestion}
                          onChange={handleChange}
                          required
                          style={form.aiSuggestedSession && form.sessionSuggestion === form.aiSuggestedSession ? { borderColor: '#10b981' } : {}}
                        >
                          <option value="">Select Session</option>
                          {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          {form.aiSuggestedSession && !SESSIONS.includes(form.aiSuggestedSession) && (
                            <option value={form.aiSuggestedSession}>{form.aiSuggestedSession} (AI Suggested)</option>
                          )}
                        </select>
                        {errors.sessionSuggestion && <div className="invalid-feedback">{errors.sessionSuggestion}</div>}
                        {form.aiSuggestedSession && (
                          <div className="ai-success-badge mt-2">
                            ✨ AI Suggested: <strong>{form.aiSuggestedSession}</strong> — you may change this manually.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-submit" disabled={submitting || analyzing}>
                      {submitting ? (
                        <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                      ) : 'Submit Abstract →'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <p className="text-center mt-3" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              By submitting, you agree to the conference terms and conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-section">
        <div className="container">
          <p className="mb-0">© 2026 International Conference on Artificial Intelligence. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
