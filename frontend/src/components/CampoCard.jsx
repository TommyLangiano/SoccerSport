import React from "react";
import { Link } from "react-router-dom";

function CampoCard({ campo, currentUser, onLikeCampo }) {
  const handleLike = async () => {
    if (!currentUser) {
      alert("Devi effettuare il login per mettere like");
      return;
    }
    await onLikeCampo(campo._id);
  };

  const userHasLiked =
    currentUser &&
    campo.likes?.some(
      (like) => like._id === currentUser.id || like === currentUser.id,
    );

  return (
    <div className="card h-100">
      <img
        src={campo.immagine}
        className="card-img-top"
        alt={campo.nome}
        style={{ height: "200px", objectFit: "cover" }}
        onError={(e) => {
          e.target.src =
            "https://www.sporteimpianti.it/wp-content/uploads/2022/03/futsal-banner-mast-pero.jpg";
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{campo.nome}</h5>
        <p className="card-text text-muted small mb-2">📍 {campo.citta}</p>
        {campo.descrizione && (
          <p className="card-text small text-secondary">
            {campo.descrizione.length > 80
              ? campo.descrizione.substring(0, 80) + "..."
              : campo.descrizione}
          </p>
        )}
        {campo.prezzo && (
          <p className="card-text">
            <strong className="text-success">€{campo.prezzo}/ora</strong>
          </p>
        )}
        <div className="mt-auto">
          <div className="d-flex gap-2">
            <Link
              to={`/campi/${campo._id}`}
              className="btn btn-primary btn-sm flex-grow-1"
            >
              Dettagli
            </Link>
            <button
              className={`btn btn-sm ${userHasLiked ? "btn-danger" : "btn-outline-danger"}`}
              onClick={handleLike}
            >
              ❤️ {campo.likes?.length || 0}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampoCard;
