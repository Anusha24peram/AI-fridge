
import React, { useRef, useState, useEffect } from 'react';
import { Ingredient } from '../types';

interface FridgeScannerProps {
  onCapture: (base64: string) => void;
  isScanning: boolean;
  ingredients: Ingredient[];
  urgentItems: Ingredient[];
  onRetry: () => void;
  onFindRecipes: () => void;
}

const FridgeScanner: React.FC<FridgeScannerProps> = ({ onCapture, isScanning, ingredients, urgentItems, onRetry, onFindRecipes }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please ensure permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg');
        onCapture(base64);
        stopCamera();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="max-w-4xl mx-auto pt-16 md:pt-0">
      {/* Expiry Warnings Banner */}
      {!isCameraActive && urgentItems.length > 0 && (
        <div className="mx-2 md:mx-0 mb-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-2xl shadow-sm animate-in fade-in slide-in-from-top duration-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700 font-bold">
                Expiry Alerts: {urgentItems.length} items in your pantry need attention.
              </p>
              <div className="mt-2 text-sm text-amber-600 flex flex-wrap gap-2">
                {urgentItems.slice(0, 3).map(item => (
                  <span key={item.id} className="bg-amber-100 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {item.name}
                  </span>
                ))}
                {urgentItems.length > 3 && <span className="text-[10px] italic">+{urgentItems.length - 3} more</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 px-2 md:px-0">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">My Smart Fridge</h2>
        <p className="text-slate-500 font-medium">Identify ingredients in seconds.</p>
      </div>

      {ingredients.length === 0 ? (
        <div className={`bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden ${isCameraActive ? 'p-0' : 'p-6 md:p-12'}`}>
          {!isCameraActive ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Scan Your Fridge</h3>
              <p className="text-slate-500 mb-8 max-w-sm">Capture a clear photo of your open fridge to see magic happen.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button 
                  disabled={isScanning}
                  onClick={startCamera}
                  className="px-8 py-5 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Open Camera
                </button>
                <button 
                  disabled={isScanning}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-5 bg-white text-indigo-600 border-2 border-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 text-lg"
                >
                  {isScanning ? (
                    <><div className="w-5 h-5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />Analyzing...</>
                  ) : (
                    <><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>Upload</>
                  )}
                </button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          ) : (
            <div className="w-full relative bg-black aspect-[3/4] md:aspect-video overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-2 border-white/20 pointer-events-none m-4 rounded-xl"></div>
              
              <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-10 px-4">
                <button 
                  onClick={stopCamera}
                  className="w-14 h-14 bg-black/40 backdrop-blur-xl text-white rounded-full flex items-center justify-center border border-white/20"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <button 
                  onClick={capturePhoto}
                  className="w-20 h-20 bg-white rounded-full p-1.5 shadow-2xl active:scale-90 transition-transform"
                >
                  <div className="w-full h-full border-4 border-slate-900 rounded-full"></div>
                </button>
                <div className="w-14 h-14 invisible"></div>
              </div>
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                <span className="text-white text-[10px] font-black uppercase tracking-widest">Live Scan</span>
              </div>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Found Ingredients</h3>
              <button 
                onClick={onRetry}
                className="p-3 bg-slate-100 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors"
                title="Rescan"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ingredients.map(item => (
                <div key={item.id} className="bg-slate-50 border border-slate-200 px-4 py-4 rounded-2xl flex items-center gap-3">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-sm" />
                  <span className="text-slate-800 font-bold capitalize text-sm">{item.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <button 
                onClick={onFindRecipes}
                className="w-full md:w-auto px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl hover:bg-indigo-700 transition-all text-lg"
              >
                Let's Cook!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FridgeScanner;
