import React, { useState } from 'react';
import PlantIdentifier from './components/PlantIdentifier';
import ChatBot from './components/ChatBot';
import { AppView } from './types';
import { CameraIcon, ChatIcon, LeafIcon } from './components/Icons';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.IDENTIFY);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-leaf-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-leaf-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-leaf-700">
            <LeafIcon className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight text-leaf-900">GreenThumb<span className="text-leaf-500 font-light">AI</span></h1>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex bg-leaf-50 p-1 rounded-lg">
             <button
              onClick={() => setCurrentView(AppView.IDENTIFY)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                currentView === AppView.IDENTIFY
                  ? 'bg-white text-leaf-700 shadow-sm'
                  : 'text-leaf-600 hover:text-leaf-800 hover:bg-leaf-100'
              }`}
            >
              <CameraIcon className="w-4 h-4" />
              <span>Identify</span>
            </button>
            <button
              onClick={() => setCurrentView(AppView.CHAT)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                currentView === AppView.CHAT
                  ? 'bg-white text-leaf-700 shadow-sm'
                  : 'text-leaf-600 hover:text-leaf-800 hover:bg-leaf-100'
              }`}
            >
              <ChatIcon className="w-4 h-4" />
              <span>Ask Expert</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {currentView === AppView.IDENTIFY ? (
           <div className="animate-fade-in">
             <div className="text-center mb-8">
               <h2 className="text-3xl font-bold text-slate-900 mb-3">Identify Your Plants</h2>
               <p className="text-slate-600 max-w-md mx-auto">Upload a clear photo to get instant identification, care guides, and toxicity alerts.</p>
             </div>
             <PlantIdentifier />
           </div>
        ) : (
           <div className="animate-fade-in h-full">
              <div className="text-center mb-6">
               <h2 className="text-2xl font-bold text-slate-900">Gardening Assistant</h2>
               <p className="text-slate-600">Chat with our AI botanist about care, diseases, and tips.</p>
             </div>
             <ChatBot />
           </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe pt-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pb-2">
          <button
            onClick={() => setCurrentView(AppView.IDENTIFY)}
            className={`flex flex-col items-center py-2 rounded-xl transition-colors ${
              currentView === AppView.IDENTIFY ? 'text-leaf-600 bg-leaf-50' : 'text-slate-500'
            }`}
          >
            <CameraIcon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Identify</span>
          </button>
          <button
            onClick={() => setCurrentView(AppView.CHAT)}
            className={`flex flex-col items-center py-2 rounded-xl transition-colors ${
              currentView === AppView.CHAT ? 'text-leaf-600 bg-leaf-50' : 'text-slate-500'
            }`}
          >
            <ChatIcon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;