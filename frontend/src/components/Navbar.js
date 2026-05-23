import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar navbar-expand-lg navbar-conference sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          ✦ ICAI 2026
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-1">
            <li className="nav-item">
              <Link className={isActive('/')} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/submit')} to="/submit">Submit Abstract</Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/admin')} to="/admin">Dashboard</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
