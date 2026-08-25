import React from 'react';
import Loader from './Loader';

export default function ProfilePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>User Profile</h1>
      <p>Welcome to your personal account!</p>
      <Loader />
    </div>
  );
}