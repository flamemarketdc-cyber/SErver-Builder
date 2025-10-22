import React from 'react';

interface LoadingSpinnerProps {
  message: string;
  subMessage?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, subMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="w-40 h-40 relative mb-4 flex items-center justify-center">
        <style>{`
          .forge-container {
            filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.5));
          }
          .forge-core {
            width: 25%;
            height: 25%;
            background-color: #ef4444;
            border-radius: 50%;
            position: absolute;
            animation: pulse-core 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
          }
          .forge-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid transparent;
            animation: spin 8s linear infinite;
          }
          .forge-ring::before {
            content: '';
            position: absolute;
            left: -2px;
            top: 50%;
            transform: translateY(-50%);
            width: 8px;
            height: 8px;
            background-color: #f87171;
            border-radius: 50%;
            box-shadow: 0 0 5px #f87171, 0 0 10px #ef4444;
          }
          .forge-ring-1 {
            border-top-color: rgba(239, 68, 68, 0.4);
            border-left-color: rgba(239, 68, 68, 0.4);
          }
          .forge-ring-2 {
            width: 75%;
            height: 75%;
            border-bottom-color: rgba(239, 68, 68, 0.4);
            border-right-color: rgba(239, 68, 68, 0.4);
            animation-direction: reverse;
            animation-duration: 6s;
          }
           .forge-ring-3 {
            width: 50%;
            height: 50%;
            border-top-color: rgba(255, 255, 255, 0.2);
            border-right-color: rgba(255, 255, 255, 0.2);
            animation-duration: 4s;
          }
          .forge-ring-3::before {
             background-color: #fff;
             box-shadow: 0 0 5px #fff, 0 0 10px #f87171;
             width: 6px;
             height: 6px;
          }


          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse-core {
            0%, 100% {
              transform: scale(0.9);
              box-shadow: 0 0 10px #ef4444, 0 0 20px #b91c1c;
            }
            50% {
              transform: scale(1.1);
              box-shadow: 0 0 20px #ef4444, 0 0 40px #b91c1c;
            }
          }
        `}</style>
        <div className="forge-container w-full h-full flex items-center justify-center">
            <div className="forge-ring forge-ring-1"></div>
            <div className="forge-ring forge-ring-2"></div>
            <div className="forge-ring forge-ring-3"></div>
            <div className="forge-core"></div>
        </div>
      </div>
      <p className="mt-4 text-xl font-semibold gradient-text">{message}</p>
      <p className="text-slate-400 min-h-[1.5rem] transition-opacity duration-300">
        {subMessage}
      </p>
    </div>
  );
};
