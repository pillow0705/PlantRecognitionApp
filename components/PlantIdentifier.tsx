import React, { useState, useRef } from 'react';
import { identifyPlantFromImage } from '../services/geminiService';
import { PlantIdentificationResult } from '../types';
import { CameraIcon, UploadIcon, WaterIcon, SunIcon, SoilIcon, LeafIcon, WarningIcon } from './Icons';

const PlantIdentifier: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PlantIdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size too large. Please select an image under 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const data = await identifyPlantFromImage(image);
      setResult(data);
    } catch (err) {
      setError("Could not identify the plant. Please try a clearer image.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-8 pb-24">
      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-leaf-100 overflow-hidden">
        <div className="p-6 text-center">
          {!image ? (
            <div 
              onClick={triggerFileInput}
              className="border-2 border-dashed border-leaf-200 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-leaf-50 transition-colors"
            >
              <div className="bg-leaf-100 p-4 rounded-full mb-4">
                <CameraIcon className="w-8 h-8 text-leaf-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">Take or upload a photo</h3>
              <p className="text-slate-500 text-sm">Tap to select a plant image</p>
            </div>
          ) : (
            <div className="relative group">
              <img 
                src={image} 
                alt="Preview" 
                className="w-full max-h-80 object-contain rounded-lg bg-slate-50" 
              />
              <div className="absolute top-2 right-2">
                <button 
                  onClick={() => { setImage(null); setResult(null); }}
                  className="bg-white/90 text-slate-700 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />

          {image && !result && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={`mt-6 w-full py-3 px-4 rounded-xl font-semibold text-white flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98] ${
                isAnalyzing ? 'bg-leaf-400 cursor-not-allowed' : 'bg-leaf-600 hover:bg-leaf-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <LeafIcon className="w-5 h-5" />
                  <span>Identify Plant</span>
                </>
              )}
            </button>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center justify-center space-x-2">
              <WarningIcon className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-sm border border-leaf-100 overflow-hidden">
            <div className="bg-leaf-600 p-6 text-white">
              <h2 className="text-3xl font-bold mb-1">{result.commonName}</h2>
              <p className="text-leaf-100 italic font-medium font-serif">{result.scientificName}</p>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-slate-700 leading-relaxed">{result.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 flex items-start space-x-3">
                  <div className="p-2 bg-sky-100 rounded-lg text-sky-600 shrink-0">
                    <WaterIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sky-900 mb-1">Water</h4>
                    <p className="text-sm text-sky-800">{result.care.water}</p>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                    <SunIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Light</h4>
                    <p className="text-sm text-amber-800">{result.care.light}</p>
                  </div>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-start space-x-3">
                  <div className="p-2 bg-stone-200 rounded-lg text-stone-600 shrink-0">
                    <SoilIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 mb-1">Soil</h4>
                    <p className="text-sm text-stone-800">{result.care.soil}</p>
                  </div>
                </div>

                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex items-start space-x-3">
                  <div className="p-2 bg-rose-100 rounded-lg text-rose-600 shrink-0">
                    <WarningIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-rose-900 mb-1">Toxicity</h4>
                    <p className="text-sm text-rose-800">{result.care.toxicity}</p>
                  </div>
                </div>
              </div>

              <div className="bg-leaf-50 p-5 rounded-xl border border-leaf-100">
                <h4 className="font-semibold text-leaf-900 mb-2 flex items-center">
                  <span className="text-xl mr-2">💡</span> Did you know?
                </h4>
                <p className="text-leaf-800 text-sm">{result.funFact}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantIdentifier;