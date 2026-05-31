import { NavLink } from "react-router-dom";

export default function Navbar() {
  // Main site navigation between the app pages.
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand">
            Countries Explorer
        </NavLink>

        <nav className="navbar__links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/countries"
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            Countries
          </NavLink>

          <NavLink
            to="/visited"
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            Visited
          </NavLink>
        </nav>
      </div>
    </header>
  );
}