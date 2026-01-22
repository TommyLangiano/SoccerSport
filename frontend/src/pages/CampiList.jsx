import React, { useState, useEffect } from "react";
import CampoCard from "../components/CampoCard.jsx";

function CampiList({ campi, loadCampi, currentUser, onLikeCampo }) {
  const [cittaFiltro, setCittaFiltro] = useState("");

  useEffect(() => {
    loadCampi();
  }, []);

  const campiFiltrati = cittaFiltro
    ? campi.filter((campo) =>
        campo.citta.toLowerCase().includes(cittaFiltro.toLowerCase()),
      )
    : campi;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Tutti i Campi</h1>

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="🔍 Cerca per città..."
            value={cittaFiltro}
            onChange={(e) => setCittaFiltro(e.target.value)}
          />
        </div>
      </div>

      {campiFiltrati.length === 0 ? (
        <div className="alert alert-info">Nessun campo trovato</div>
      ) : (
        <div className="row g-4">
          {campiFiltrati.map((campo) => (
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

export default CampiList;
