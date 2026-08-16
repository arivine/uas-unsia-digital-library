import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Secure UNSIA Digital Library Dashboard &copy; 2026</p>
      </footer>
    </div>
  );
}
