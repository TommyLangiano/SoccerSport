import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function CampoDetail({ currentUser, onLikeCampo, onDeleteCampo }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campo, setCampo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadCampo = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/campi/${id}`, { headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Errore caricamento campo");
      }

      setCampo(data);
    } catch (error) {
      console.error("Errore caricamento campo:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      alert("Devi effettuare il login per mettere like");
      return;
    }

    const result = await onLikeCampo(id);
    if (result.success) {
      loadCampo();
    }
  };

  const handleDelete = async () => {
    const result = await onDeleteCampo(id);
    if (result.success) {
      navigate("/");
    } else {
      alert(result.message);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (!campo) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Campo non trovato</div>
      </div>
    );
  }

  const userHasLiked =
    currentUser &&
    campo.likes?.some(
      (like) => like._id === currentUser.id || like === currentUser.id,
    );

  const isOwner = currentUser && campo.gestore?._id === currentUser.id;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <img
            src={campo.immagine}
            alt={campo.nome}
            className="img-fluid rounded mb-3"
            style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
            onError={(e) => {
              e.target.src =
                "https://www.sporteimpianti.it/wp-content/uploads/2022/03/futsal-banner-mast-pero.jpg";
            }}
          />

          <h1>{campo.nome}</h1>

          <p className="lead">{campo.descrizione}</p>

          <div className="mb-3">
            <strong>📍 Città:</strong> {campo.citta}
          </div>

          {campo.indirizzo && (
            <div className="mb-3">
              <strong>📌 Indirizzo:</strong> {campo.indirizzo}
            </div>
          )}

          {campo.prezzo && (
            <div className="mb-3">
              <strong>💰 Prezzo:</strong> €{campo.prezzo}/ora
            </div>
          )}

          <div className="mb-3">
            <strong>👤 Gestore:</strong>{" "}
            {campo.gestore?.username || "Sconosciuto"}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Azioni</h5>

              <button
                className={`btn w-100 mb-2 ${userHasLiked ? "btn-danger" : "btn-outline-danger"}`}
                onClick={handleLike}
              >
                ❤️ {userHasLiked ? "Rimuovi Like" : "Metti Like"} (
                {campo.likes?.length || 0})
              </button>

              {isOwner && (
                <>
                  <Link
                    to={`/campi/${campo._id}/modifica`}
                    className="btn btn-warning w-100 mb-2"
                  >
                    ✏️ Modifica Campo
                  </Link>
                  <button
                    className="btn btn-danger w-100"
                    onClick={handleDelete}
                  >
                    🗑️ Elimina Campo
                  </button>
                </>
              )}

              <Link to="/" className="btn btn-secondary w-100 mt-2">
                ← Torna alla Home
              </Link>
            </div>
          </div>

          {campo.likes && campo.likes.length > 0 && (
            <div className="card mt-3">
              <div className="card-body">
                <h6 className="card-title">❤️ Piace a:</h6>
                <ul className="list-unstyled">
                  {campo.likes.map((like) => (
                    <li key={like._id || like}>{like.username || "Utente"}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CampoDetail;
