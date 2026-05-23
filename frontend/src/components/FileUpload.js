import React, { useRef, useState } from 'react';

export default function FileUpload({ label, name, onChange, error, required, accept, helpText }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : '');
    onChange(e);
  };

  return (
    <div className="mb-3">
      <label className="form-label">
        {label}{required && <span className="text-danger ms-1">*</span>}
      </label>
      <div
        className={`file-upload-zone${fileName ? ' has-file' : ''}${error ? ' border-danger' : ''}`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          id={name}
          name={name}
          className="d-none"
          onChange={handleChange}
          accept={accept}
          required={required}
        />
        <div className="file-upload-icon">
          {fileName ? '✅' : '📁'}
        </div>
        {fileName ? (
          <p className="mb-0 fw-medium" style={{ color: '#059669', fontSize: '0.9rem' }}>{fileName}</p>
        ) : (
          <>
            <p className="mb-1 fw-medium" style={{ fontSize: '0.9rem' }}>Click to upload your abstract</p>
            <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>{helpText}</p>
          </>
        )}
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}
