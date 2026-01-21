import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function AddCampo({ onCampoCreated }) {
    const [nome, setNome] = useState('');
    const [descrizione, setDescrizione] = useState('');
    const [citta, setCitta] = useState('');
    const [indirizzo, setIndirizzo] = useState('');
    const [prezzo, setPrezzo] = useState('');
    const [immagine, setImmagine] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/campi`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nome,
                    descrizione,
                    citta,
                    indirizzo,
                    prezzo: prezzo ? Number(prezzo) : undefined,
                    immagine
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || 'Errore creazione campo');
            }

            onCampoCreated(data.campo);
            navigate('/');
        } catch (error) {
            console.error("Errore creazione campo:", error);
            setError(error.message);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Aggiungi Nuovo Campo</h2>
                            
                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nome Campo *</label>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Descrizione</label>
                                    <textarea 
                                        className="form-control"
                                        rows="3"
                                        value={descrizione}
                                        onChange={(e) => setDescrizione(e.target.value)}
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Città *</label>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        value={citta}
                                        onChange={(e) => setCitta(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Indirizzo</label>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        value={indirizzo}
                                        onChange={(e) => setIndirizzo(e.target.value)}
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Prezzo (€/ora)</label>
                                    <input 
                                        type="number" 
                                        className="form-control"
                                        value={prezzo}
                                        onChange={(e) => setPrezzo(e.target.value)}
                                        min="0"
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">URL Immagine</label>
                                    <input 
                                        type="url" 
                                        className="form-control"
                                        value={immagine}
                                        onChange={(e) => setImmagine(e.target.value)}
                                        placeholder="https://esempio.com/immagine.jpg"
                                    />
                                </div>
                                
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-success">
                                        Crea Campo
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/')}
                                    >
                                        Annulla
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddCampo;