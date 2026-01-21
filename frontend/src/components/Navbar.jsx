import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
      <div className="container py-2">
        <Link className="navbar-brand fw-bold fs-3" to="/">
          ⚽ SoccerSport
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link fs-5 px-3" to="/">
                Home
              </Link>
            </li>

            {user ? (
              <>
                {user.ruolo === "gestore" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link fs-5 px-3" to="/campi/nuovo">
                        ➕ Aggiungi Campo
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link fs-5 px-3" to="/profilo">
                        👤 Profilo
                      </Link>
                    </li>
                  </>
                )}
                <li className="nav-item ms-2">
                  <button
                    className="btn btn-outline-light px-4 py-2"
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link fs-5 px-3" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <Link
                    className="btn btn-outline-light px-4 py-2"
                    to="/register"
                  >
                    Registrati
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
