// app\settings\layout.js
//import React from 'react';
import Sidebar from '../components/Sidebar';
import TopMenu from '../components/TopMenu';

export default function SettingsLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <TopMenu />
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
