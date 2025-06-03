import { Link, NavLink as RouterNavLink } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/favorites', label: 'Favorites' },
];

const NavLink = ({ to, label }) => (
  <RouterNavLink
    to={to}
    className={({ isActive }) => (isActive ? 'font-bold' : 'hover:underline')}
  >
    {label}
  </RouterNavLink>
);

function Header() {
  return (
    <header className="bg-pink-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-0 py-3 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-bold tracking-wide transition-all duration-300 ease-in-out hover:scale-110"
        >
          MovieApp
        </Link>
        
        <nav className="space-x-4 text-sm sm:text-base">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} label={label} />
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
