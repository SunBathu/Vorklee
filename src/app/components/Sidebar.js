'use client';
import { useState } from 'react';
import Link from 'next/link';

const Sidebar = () => {
  const [hoverSubMenu, setHoverSubMenu] = useState(false);

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link href="/">Dashboard</Link>
        </li>
        <li
          className="submenu-container"
          onMouseEnter={() => setHoverSubMenu(true)}
          onMouseLeave={() => setHoverSubMenu(false)}
        >
          <span className="submenu-button">Settings</span>
          {hoverSubMenu && (
            <ul className="submenu">
              <li>
                <Link href="/settings/global">Global Settings</Link>
              </li>
              <li>
                <Link href="/settings/pc">PC-Specific Settings</Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
