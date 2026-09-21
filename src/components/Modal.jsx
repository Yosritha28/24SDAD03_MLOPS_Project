import React from 'react';

/**
 * Generic modal component.
 * Props:
 * - isOpen: boolean – whether to show the modal.
 * - onClose: function – called when overlay is clicked or close action triggered.
 * - title: optional string – displayed at the top of the modal.
 * - children: modal content.
 * - className: additional CSS classes for the modal content.
 * - overlayClassName: additional classes for the overlay.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  overlayClassName = ''
}) {
  if (!isOpen) return null;

  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const contentStyles = {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  };

  return (
    <div
      className={overlayClassName}
      style={overlayStyles}
      onClick={onClose}
    >
      <div
        className={className}
        style={contentStyles}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3>{title}</h3>}
        {children}
      </div>
    </div>
  );
}
