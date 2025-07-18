import React, { useState } from 'react';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { PhotoUpload } from './components/PhotoUpload';
import { PhotoGrid } from './components/PhotoGrid';
import { useAuth } from './hooks/useAuth';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [photoRefreshTrigger, setPhotoRefreshTrigger] = useState(0);
  const { user, loading } = useAuth();

  const handlePhotoUploaded = () => {
    setPhotoRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthClick={() => setIsAuthModalOpen(true)} />
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">My Photos</h2>
                <p className="text-gray-600">
                  Your personal photo collection
                </p>
              </div>
              <PhotoUpload onPhotoUploaded={handlePhotoUploaded} />
            </div>

            <PhotoGrid refreshTrigger={photoRefreshTrigger} />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Camera className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to PhotoShare
              </h2>
              <p className="text-gray-600 mb-8">
                Share your favorite moments with beautiful photo uploads.
                Sign in to start building your personal photo collection.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;