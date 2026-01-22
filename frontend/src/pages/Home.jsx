import React, { useState, useEffect } from 'react';
import CampoCard from '../components/CampoCard.jsx';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Home({ currentUser, onLikeCampo }) {
    const [campi, setCampi] = useState([]);
    const [cittaFiltro, setCittaFiltro] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCampi();
    }, []);

    const loadCampi = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/campi`);
            const data = await response.json();
            if (response.ok) {
                setCampi(data.campi || []);
            }
        } catch (error) {
            console.error("Errore caricamento campi:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLikeInHome = async (campoId) => {
        if (!currentUser) {
            alert('Effettua il login per mettere like');
            return;
        }
        const result = await onLikeCampo(campoId);
        if (result.success) {
            loadCampi();
        }
    };

    const campiFiltrati = cittaFiltro
        ? campi.filter(campo => 
            campo.citta.toLowerCase().includes(cittaFiltro.toLowerCase())
          )
        : campi;

        return (
        <div className="container mt-4">
            <div className="text-center mb-4">
                <h1 className="display-4">⚽ SoccerSport</h1>
                <p className="lead text-muted">
                    Scopri i migliori campi da calcio in Italia
                </p>
            </div>

            <div className="row mb-4">
                <div className="col-md-6 mx-auto">
                    <input 
                        type="text" 
                        className="form-control form-control-lg" 
                        placeholder="🔍 Cerca per città..."
                        value={cittaFiltro}
                        onChange={(e) => setCittaFiltro(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Caricamento...</span>
                    </div>
                </div>
            ) : campiFiltrati.length === 0 ? (
                <div className="alert alert-info text-center">
                    {cittaFiltro ? 'Nessun campo trovato per questa città' : 'Nessun campo disponibile'}
                </div>
            ) : (
                <div className="row g-4">
                    {campiFiltrati.map(campo => (
                        <div key={campo._id} className="col-md-4">
                            <CampoCard
                                campo={campo}
                                currentUser={currentUser}
                                onLikeCampo={handleLikeInHome}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;