import React from 'react';

export default function FormField({ label, name, type = 'text', value, onChange, error, required, placeholder, children, as }) {
  const baseClass = as === 'select' ? 'form-select' : 'form-control';
  const className = `${baseClass}${error ? ' is-invalid' : ''}`;
  const inputProps = { name, value, onChange, required, placeholder, className, id: name };

  let input;
  if (as === 'select') {
    input = <select {...inputProps}>{children}</select>;
  } else if (as === 'textarea') {
    input = <textarea {...inputProps} rows="4" />;
  } else {
    input = <input {...inputProps} type={type} />;
  }

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}{required && <span className="text-danger ms-1">*</span>}
      </label>
      {input}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
