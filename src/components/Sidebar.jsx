import React from 'react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Sidebar</h2>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
      <div className="sidebar-info">
        <p>Salary Visualizer helps you see your earnings in real time!</p>
      </div>
    </aside>
  );
} 