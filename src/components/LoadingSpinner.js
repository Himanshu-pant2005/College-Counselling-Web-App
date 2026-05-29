export default function LoadingSpinner({ message = 'Loading application data...' }) {
  return (
    <div className="spinner-wrapper animate-fade-in">
      <div className="spinner-glow"></div>
      <div className="spinner-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
      <p className="spinner-message">{message}</p>

      <style jsx>{`
        .spinner-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          min-height: 250px;
          position: relative;
        }
        .spinner-glow {
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--primary-glow) 0%, rgba(0,0,0,0) 70%);
          filter: blur(20px);
          animation: pulse 2s infinite ease-in-out;
        }
        .spinner-circles {
          position: relative;
          width: 60px;
          height: 60px;
          margin-bottom: 24px;
        }
        .circle {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }
        .circle-1 {
          animation-delay: -0.45s;
        }
        .circle-2 {
          border-top-color: var(--secondary);
          animation-delay: -0.3s;
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
        }
        .circle-3 {
          border-top-color: var(--success);
          animation-delay: -0.15s;
          width: 60%;
          height: 60%;
          top: 20%;
          left: 20%;
        }
        .spinner-message {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-secondary);
          letter-spacing: 0.02em;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
