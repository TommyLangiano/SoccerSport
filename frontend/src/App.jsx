// Import delle librerie necessarie
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

// URL base dell'API, preso dalle variabili d'ambiente
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// App è il componente principale dell'applicazione
function App() {
  // Hook useState per gestire lo stato dell'utente loggato
  const [currentUser, setCurrentUser] = useState(null);
  // Stato per la lista dei campi
  const [campi, setCampi] = useState([]);
  // Stato per loading
  const [loading, setLoading] = useState(true);

  // useEffect per controllare lo stato di login al mount
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
        // Se errore, pulisci localStorage
        handleLogout(false);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []); // Array di dipendenze vuoto: esegui solo al mount

  // Funzione per caricare tutti i campi
  const loadCampi = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/campi`, { headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || `Errore caricamento campi: ${response.status}`,
        );
      }

      setCampi(data.campi || []);
    } catch (error) {
      console.error("Errore caricamento campi:", error);
    }
  };

  // Login
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
        localStorage.setItem("user", JSON.stringify(data.user));
        setCurrentUser(data.user);
        return { success: true };
      }
    } catch (error) {
      console.error("Errore login:", error);
      return { success: false, message: error.message };
    }
  };

  // Register
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
        localStorage.setItem("user", JSON.stringify(data.user));
        setCurrentUser(data.user);
        return { success: true };
      }
    } catch (error) {
      console.error("Errore registrazione:", error);
      return { success: false, message: error.message };
    }
  };

  // Logout
  const handleLogout = async (callApi = true) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  // Crea nuovo campo (solo gestore)
  const handleCampoCreated = (newCampo) => {
    setCampi((prevCampi) => [newCampo, ...prevCampi]);
  };

  // Elimina campo (solo proprietario)
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

      setCampi((prevCampi) =>
        prevCampi.filter((campo) => campo._id !== campoId),
      );
      return { success: true };
    } catch (error) {
      console.error("Errore eliminazione campo:", error);
      return { success: false, message: error.message };
    }
  };

  // Modifica campo (solo proprietario)
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

  // Like/Unlike campo
  const handleLikeCampo = async (campoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/campi/${campoId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `Errore like: ${response.status}`);
      }

      if (data?.campo) {
        setCampi((prevCampi) =>
          prevCampi.map((c) => (c._id === data.campo._id ? data.campo : c)),
        );
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
          {/* Route pubbliche */}
          <Route path="/" element={<Home />} />

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

          {/* Route solo per NON loggati */}
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

          {/* Route solo per gestori loggati */}
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

          {/* Route modifica campo (solo proprietario) */}
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

          {/* Profilo gestore */}
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
