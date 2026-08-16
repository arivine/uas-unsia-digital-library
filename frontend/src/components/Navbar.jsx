import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LibraryIcon, MenuIcon } from './Icons';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/books', label: 'Data Buku' },
    { to: '/members', label: 'Data Anggota' },
    { to: '/loans', label: 'Peminjaman' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <span className="brand-icon">
            <LibraryIcon size={26} />
          </span>
          <span>UNSIA Digital Library</span>
        </div>

        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <MenuIcon size={22} />
        </button>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className={`nav-user ${open ? 'open' : ''}`}>
          <span className="user-name">{user?.name}</span>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
