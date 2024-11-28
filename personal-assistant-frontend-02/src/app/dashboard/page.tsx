'use client';

import SignIn from './Dashboard';

export default function DashBoardPage() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <SignIn />
    </div>
  );
}
