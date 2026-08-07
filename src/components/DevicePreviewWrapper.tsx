import React from 'react';
import { Smartphone } from 'lucide-react';

interface DevicePreviewWrapperProps {
  isDevicePreview: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const DevicePreviewWrapper: React.FC<DevicePreviewWrapperProps> = ({
  isDevicePreview,
  onToggle,
  children
}) => {
  if (!isDevicePreview) {
    return <div className="min-h-screen bg-indigo-50 text-slate-900">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 p-2 sm:p-6 flex flex-col items-center justify-center">
      {/* Device Toolbar */}
      <div className="mb-3 flex items-center space-x-3 text-xs text-slate-300">
        <span className="flex items-center space-x-1 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-white">iPhone 15 Pro Mobile Preview</span>
        </span>
        <button
          onClick={onToggle}
          className="text-amber-400 hover:underline font-medium"
        >
          Exit Frame Mode
        </button>
      </div>

      {/* Phone Shell */}
      <div className="relative w-full max-w-[393px] h-[830px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700 overflow-hidden flex flex-col">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-900/50" />
        </div>

        {/* Screen Content Window */}
        <div className="relative w-full h-full bg-slate-50 rounded-[38px] overflow-y-auto scrollbar-none pt-4 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
