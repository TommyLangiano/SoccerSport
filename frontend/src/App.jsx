import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CampoDetail from "./pages/CampoDetail.jsx";
import AddCampo from "./pages/AddCampo.jsx";
import EditCampo from "./pages/EditCampo.jsx";
import Profilo from "./pages/Profilo.jsx";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      try {
        if (storedUser && token) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Errore durante il caricamento dei dati iniziali:", e);
        handleLogout(false);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);
  const handleLogin = async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `Errore login: ${response.status}`);
      }

      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        setCurrentUser(data.user);
        return { success: true };
      }
    } catch (error) {
      console.error("Errore login:", error);
      return { success: false, message: error.message };
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || `Errore registrazione: ${response.status}`,
        );
      }

      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        setCurrentUser(data.user);
        return { success: true };
      }
    } catch (error) {
      console.error("Errore registrazione:", error);
      return { success: false, message: error.message };
    }
  };

  const handleRefreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        handleLogout();
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        return true;
      }

      handleLogout();
      return false;
    } catch (error) {
      handleLogout();
      return false;
    }
  };

  const handleLogout = async (callApi = true) => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (callApi && refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {}
    }

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const handleCampoCreated = () => {};

  const handleDeleteCampo = async (campoId) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo campo?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/campi/${campoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.message || `Errore eliminazione: ${response.status}`,
        );
      }

      return { success: true };
    } catch (error) {
      console.error("Errore eliminazione campo:", error);
      return { success: false, message: error.message };
    }
  };

  const handleUpdateCampo = async (campoId, campoData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/campi/${campoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(campoData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `Errore modifica: ${response.status}`);
      }

      return { success: true, campo: data.campo };
    } catch (error) {
      console.error("Errore modifica campo:", error);
      return { success: false, message: error.message };
    }
  };

  const handleLikeCampo = async (campoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/campi/${campoId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        const refreshed = await handleRefreshToken();
        if (refreshed) {
          return handleLikeCampo(campoId);
        }
        return { success: false, message: "Sessione scaduta" };
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `Errore like: ${response.status}`);
      }

      return { success: true, data };
    } catch (error) {
      console.error("Errore like campo:", error);
      return { success: false, message: error.message };
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={currentUser} onLogout={handleLogout} />

        <Routes>
          <Route
            path="/"
            element={
              <Home currentUser={currentUser} onLikeCampo={handleLikeCampo} />
            }
          />

          <Route
            path="/campi/:id"
            element={
              <CampoDetail
                currentUser={currentUser}
                onLikeCampo={handleLikeCampo}
                onDeleteCampo={handleDeleteCampo}
              />
            }
          />

          <Route
            path="/login"
            element={
              currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/register"
            element={
              currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <Register onRegister={handleRegister} />
              )
            }
          />

          <Route
            path="/campi/nuovo"
            element={
              currentUser?.ruolo === "gestore" ? (
                <AddCampo onCampoCreated={handleCampoCreated} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/campi/:id/modifica"
            element={
              currentUser ? (
                <EditCampo onUpdateCampo={handleUpdateCampo} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/profilo"
            element={
              currentUser?.ruolo === "gestore" ? (
                <Profilo
                  currentUser={currentUser}
                  onLikeCampo={handleLikeCampo}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
