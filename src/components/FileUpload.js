'use client';

import { useState, useRef } from 'react';

export default function FileUpload({ onFileSelect, existingFile = null, label = 'Upload Payment Receipt' }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(existingFile);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile) => {
    if (!selectedFile) return;
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      alert('Only PDF and Image files (JPEG, PNG) are supported.');
      return;
    }

    // Check size limit (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    setFile(selectedFile);
    onFileSelect(selectedFile);

    // Create preview
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // PDF
      setPreview('pdf');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="file-upload-wrapper">
      <label className="form-label">{label}</label>

      {!preview ? (
        <div
          className={`dropzone glass-card ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input
            ref={inputRef}
            type="file"
            className="file-input-hidden"
            accept="image/*,.pdf"
            onChange={handleChange}
          />
          <div className="dropzone-content">
            <div className="upload-icon">📁</div>
            <p className="primary-text">Drag & drop your receipt, or <span>browse</span></p>
            <p className="secondary-text">Supports PDF, PNG, JPG (Max 5MB)</p>
          </div>
        </div>
      ) : (
        <div className="preview-container glass-card">
          <div className="preview-header">
            <span className="file-info-text">
              {file ? file.name : 'Uploaded Receipt'} ({file ? `${(file.size / 1024).toFixed(1)} KB` : 'Attached'})
            </span>
            <button type="button" onClick={handleRemove} className="remove-btn">
              Remove
            </button>
          </div>

          <div className="preview-body">
            {preview === 'pdf' || (typeof preview === 'string' && preview.endsWith('.pdf')) ? (
              <div className="pdf-preview-box">
                <span className="pdf-icon">📄</span>
                <span>PDF Document</span>
                {existingFile && (
                  <a href={existingFile} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }}>
                    View PDF
                  </a>
                )}
              </div>
            ) : (
              <div className="image-preview-box">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Receipt Preview" className="preview-img" />
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .file-upload-wrapper {
          width: 100%;
          margin-bottom: 20px;
        }
        .dropzone {
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-lg);
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: var(--transition-normal);
          background-color: rgba(15, 23, 42, 0.2);
        }
        .dropzone:hover, .dropzone.drag-active {
          border-color: var(--primary);
          background-color: rgba(59, 130, 246, 0.05);
        }
        .file-input-hidden {
          display: none;
        }
        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .upload-icon {
          font-size: 2.2rem;
          margin-bottom: 8px;
        }
        .primary-text {
          font-size: 0.95rem;
          font-weight: 600;
        }
        .primary-text span {
          color: var(--primary);
          text-decoration: underline;
        }
        .secondary-text {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        /* Preview container */
        .preview-container {
          padding: 16px;
          border-radius: var(--radius-lg);
        }
        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .file-info-text {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .remove-btn {
          background: none;
          border: none;
          color: var(--danger);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }
        .remove-btn:hover {
          text-decoration: underline;
        }
        .preview-body {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0,0,0,0.2);
          border-radius: var(--radius-md);
          padding: 16px;
          min-height: 180px;
        }
        .pdf-preview-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--text-secondary);
          font-weight: 600;
        }
        .pdf-icon {
          font-size: 3rem;
          margin-bottom: 8px;
        }
        .image-preview-box {
          width: 100%;
          max-height: 300px;
          display: flex;
          justify-content: center;
          overflow: hidden;
          border-radius: var(--radius-sm);
        }
        .preview-img {
          max-width: 100%;
          max-height: 280px;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
}
