import React from 'react';
import { Camera, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onAuthClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">PhotoShare</h1>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={20} />
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};