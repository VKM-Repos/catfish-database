import React from 'react'

export function LoadingScreen() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh',
        width: '100dvw',
        position: 'fixed',
        inset: 0,
        top: 0,
        left: 0,
        zIndex: 500000,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          border: '5px solid rgba(255, 255, 255, 0.2)',
          borderTop: '5px solid #651391',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}
