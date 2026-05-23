import React from 'react';

const countryCodes = [
  { code: '+1', label: 'US/CA (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+91', label: 'India (+91)' },
  { code: '+86', label: 'China (+86)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+33', label: 'France (+33)' },
  { code: '+81', label: 'Japan (+81)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+55', label: 'Brazil (+55)' },
  { code: '+82', label: 'S. Korea (+82)' },
  { code: '+39', label: 'Italy (+39)' },
  { code: '+34', label: 'Spain (+34)' },
  { code: '+7', label: 'Russia (+7)' },
  { code: '+27', label: 'S. Africa (+27)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+65', label: 'Singapore (+65)' },
  { code: '+60', label: 'Malaysia (+60)' },
  { code: '+234', label: 'Nigeria (+234)' },
  { code: '+52', label: 'Mexico (+52)' },
  { code: '+966', label: 'Saudi (+966)' }
];

export default function PhoneInput({ label, codeName, codeValue, numberName, numberValue, onChange, error, required }) {
  return (
    <div className="mb-3">
      <label className="form-label">
        {label}{required && <span className="text-danger ms-1">*</span>}
      </label>
      <div className="input-group">
        <select
          name={codeName}
          value={codeValue}
          onChange={onChange}
          className={`form-select${error ? ' is-invalid' : ''}`}
          style={{ maxWidth: '150px' }}
          required={required}
        >
          <option value="">Code</option>
          {countryCodes.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
        </select>
        <input
          type="tel"
          name={numberName}
          value={numberValue}
          onChange={onChange}
          className={`form-control${error ? ' is-invalid' : ''}`}
          placeholder="WhatsApp Number"
          required={required}
        />
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}
