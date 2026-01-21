import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CampoCard from "../components/CampoCard.jsx";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Profilo({ currentUser, onLikeCampo }) {
  const [mieiCampi, setMieiCampi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadMieiCampi();
    }
  }, [currentUser]);

  const loadMieiCampi = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/campi`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        // Filtra solo i campi del gestore loggato
        const campiDelGestore = data.campi.filter(
          (campo) =>
            campo.gestore._id === currentUser.id ||
            campo.gestore === currentUser.id,
        );
        setMieiCampi(campiDelGestore);
      }
    } catch (error) {
      console.error("Errore caricamento campi:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">
          Devi effettuare il login per vedere il tuo profilo
        </div>
      </div>
    );
  }

  if (currentUser.ruolo !== "gestore") {
    return (
      <div className="container mt-5">
        <div className="alert alert-info text-center">
          Solo i gestori hanno accesso al profilo con i loro campi
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Il Mio Profilo</h1>
          <p className="text-muted">
            Benvenuto, <strong>{currentUser.username}</strong> (
            {currentUser.email})
          </p>
        </div>
        <Link to="/campi/nuovo" className="btn btn-success">
          ➕ Aggiungi Nuovo Campo
        </Link>
      </div>

      <h3 className="mb-3">I Miei Campi ({mieiCampi.length})</h3>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </div>
      ) : mieiCampi.length === 0 ? (
        <div className="alert alert-info text-center">
          <p className="mb-3">Non hai ancora creato nessun campo</p>
          <Link to="/campi/nuovo" className="btn btn-success">
            Crea il tuo primo campo
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {mieiCampi.map((campo) => (
            <div key={campo._id} className="col-md-4">
              <CampoCard
                campo={campo}
                currentUser={currentUser}
                onLikeCampo={onLikeCampo}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profilo;
