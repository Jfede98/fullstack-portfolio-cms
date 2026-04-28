import { type FC } from 'react';
import { createPortal } from 'react-dom';
import { PHASE_MESSAGES, PHASE_ORDER } from '../constants/homepage';
import { TOverlayProps } from '../interfaces/overlay';

const Overlay: FC<TOverlayProps> = ({ phase }) => {
  const isDone = phase === 'done';
  const isError = phase === 'error';

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(8, 8, 18, 0.88)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        gap: '28px',
      }}
    >
      {isDone ? (
        <span style={{ fontSize: '72px', lineHeight: 1 }}>✅</span>
      ) : isError ? (
        <span style={{ fontSize: '72px', lineHeight: 1 }}>❌</span>
      ) : (
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            border: '6px solid rgba(255,255,255,0.12)',
            borderTopColor: '#7b79ff',
            animation: 'sb-restore-spin 0.85s linear infinite',
          }}
        />
      )}

      <div style={{ textAlign: 'center', maxWidth: '420px', padding: '0 16px' }}>
        <p
          style={{
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {PHASE_MESSAGES[phase]}
        </p>
        {!isDone && !isError && (
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '14px',
              marginTop: '10px',
              lineHeight: 1.5,
            }}
          >
            Por favor no cierres ni recargues la página manualmente.
            <br />
            Este proceso puede tardar entre 1 y 3 minutos.
          </p>
        )}
      </div>

      {!isDone && !isError && (
        <div style={{ display: 'flex', gap: '8px' }}>
          {PHASE_ORDER.map((p) => (
            <div
              key={p}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: p === phase ? '#7b79ff' : 'rgba(255,255,255,0.2)',
                transition: 'background-color 0.3s',
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes sb-restore-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const RestoreOverlay: FC<TOverlayProps> = (props) =>
  createPortal(<Overlay {...props} />, document.body);
