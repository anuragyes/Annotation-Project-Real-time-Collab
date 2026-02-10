

import React, { useState, useEffect } from 'react';
import LoginRegister from "../src/Pages/LoginRegsiterPage";
import UploadDocument from '../src/Pages/UploadDocument';
import AnnotationManager from './Pages/AnnotationManager';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('annotation'); // or 'upload'

  useEffect(() => {
    // Check if user is already logged in on component mount
    const token = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('userEmail');

    if (token && storedEmail) {
      // You might want to validate the token with your backend here
      setIsLoggedIn(true);
      setUserEmail(storedEmail);
    }

    setLoading(false);
  }, []);

  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserEmail('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginRegister onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Annotation Manager
                </span>
              </div>
              
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <button
                  onClick={() => setCurrentPage('annotation')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'annotation' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Documents & Annotations
                </button>
                <button
                  onClick={() => setCurrentPage('upload')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'upload' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Upload Document
                </button>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Welcome,</span>
                  <span className="ml-1 text-blue-600">{userEmail}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => setCurrentPage('annotation')}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${currentPage === 'annotation' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              Documents & Annotations
            </button>
            <button
              onClick={() => setCurrentPage('upload')}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${currentPage === 'upload' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              Upload Document
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentPage === 'annotation' ? (
            <AnnotationManager />
          ) : (
            <UploadDocument />
          )}
        </div>
      </main>

    
    </div>
  );
}

export default App;