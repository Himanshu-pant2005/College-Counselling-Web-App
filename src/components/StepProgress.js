'use client';

export default function StepProgress({ currentStep = 1, isFinished = false }) {
  const steps = [
    { num: 1, label: 'Profile' },
    { num: 2, label: 'Academic Marks' },
    { num: 3, label: 'Branch Allotment' },
    { num: 4, label: 'Fee Payment' },
    { num: 5, label: 'Offer Letter' },
  ];

  return (
    <div className="progress-container glass-card">
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: isFinished ? '100%' : `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>

      <div className="progress-steps-row">
        {steps.map((step) => {
          const isCompleted = isFinished || step.num < currentStep;
          const isActive = !isFinished && step.num === currentStep;
          const isPending = !isFinished && step.num > currentStep;

          let stepClass = 'step-node';
          if (isCompleted) stepClass += ' completed';
          if (isActive) stepClass += ' active';
          if (isPending) stepClass += ' pending';

          return (
            <div key={step.num} className={stepClass}>
              <div className="step-circle">
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <span>{step.num}</span>
                )}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .progress-container {
          padding: 24px 30px;
          position: relative;
          width: 100%;
          margin-bottom: 30px;
        }
        .progress-bar-track {
          position: absolute;
          top: 42px;
          left: 50px;
          right: 50px;
          height: 4px;
          background-color: var(--border-color);
          border-radius: 2px;
          z-index: 1;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--accent-gradient);
          border-radius: 2px;
          transition: width var(--transition-slow);
        }
        .progress-steps-row {
          display: flex;
          justify-content: space-between;
          position: relative;
          z-index: 2;
        }
        .step-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 80px;
        }
        .step-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: var(--bg-primary);
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-secondary);
          transition: var(--transition-normal);
        }
        .step-label {
          margin-top: 10px;
          font-size: 0.8rem;
          font-weight: 600;
          text-align: center;
          color: var(--text-secondary);
          white-space: nowrap;
          transition: var(--transition-normal);
        }
        .step-node.completed .step-circle {
          background: var(--success);
          border-color: var(--success);
          color: white;
          box-shadow: 0 0 15px var(--success-glow);
        }
        .step-node.completed .step-label { color: var(--success); }
        .step-node.active .step-circle {
          background-color: var(--bg-primary);
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 0 15px var(--primary-glow);
          transform: scale(1.1);
        }
        .step-node.active .step-label { color: var(--primary); font-weight: 700; }
        .step-node.pending .step-circle { background-color: var(--bg-secondary); }

        @media (max-width: 600px) {
          .progress-bar-track { display: none; }
          .progress-steps-row { flex-direction: column; gap: 16px; align-items: flex-start; }
          .step-node { flex-direction: row; gap: 16px; width: 100%; }
          .step-label { margin-top: 0; font-size: 0.95rem; }
          .progress-container { padding: 16px 20px; }
        }
      `}</style>
    </div>
  );
}