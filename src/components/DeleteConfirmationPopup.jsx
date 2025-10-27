import React from 'react';

const DeleteConfirmationPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemType = 'item',
  itemName = '',
  isLoading = false 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div 
      className="popup-overlay"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        className="popup-content"
        style={{
          background: 'white',
          borderRadius: 'var(--border-radius)',
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          boxShadow: 'var(--shadow-heavy)',
          border: '1px solid var(--border-color)',
          animation: 'slideUp 0.3s ease-out',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--text-light)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--secondary-color)';
            e.target.style.color = 'var(--text-dark)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = 'var(--text-light)';
          }}
        >
          ×
        </button>

        {/* Warning Icon */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
          }}>
            <span style={{
              fontSize: '2rem',
              color: 'white',
              fontWeight: 'bold'
            }}>
              !
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--text-dark)',
            marginBottom: '0.5rem'
          }}>
            Delete {itemType}?
          </h3>
          
          {itemName && (
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-dark)',
              fontWeight: '500',
              marginBottom: '0.5rem',
              background: 'var(--secondary-color)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--border-radius-sm)',
              border: '1px solid var(--border-color)'
            }}>
              "{itemName}"
            </p>
          )}
          
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-light)',
            lineHeight: '1.5'
          }}>
            This action cannot be undone. The {itemType} will be permanently deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="button button-secondary"
            style={{
              flex: 1,
              background: 'transparent',
              color: 'var(--text-dark)',
              border: '2px solid var(--border-color)',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--border-radius-sm)',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '600',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--secondary-color)';
              e.target.style.borderColor = 'var(--primary-light)';
              e.target.style.color = 'var(--primary-color)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.color = 'var(--text-dark)';
            }}
          >
            Cancel
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="button button-danger"
            style={{
              flex: 1,
              background: isLoading ? '#6c757d' : '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--border-radius-sm)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem',
              fontWeight: '600',
              transition: 'var(--transition)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.background = '#c82333';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = 'var(--shadow-medium)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.background = '#dc3545';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '0.5rem'
                }} />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DeleteConfirmationPopup;
