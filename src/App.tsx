import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ClaimIdentityPage from './pages/ClaimIdentityPage';
import CreateStoryPage from './pages/CreateStoryPage';
import StoryPage from './pages/StoryPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/claim-identity" element={<ClaimIdentityPage />} />
        <Route path="/create-story" element={<CreateStoryPage />} />
        <Route path="/story/:storyId" element={<StoryPage />} />
      </Routes>
    </div>
  );
}

export default App;