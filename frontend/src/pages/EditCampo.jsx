import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function EditCampo({ onUpdateCampo }) {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [nome, setNome] = useState('');
    const [descrizione, setDescrizione] = useState('');
    const [citta, setCitta] = useState('');
    const [indirizzo, setIndirizzo] = useState('');
    const [prezzo, setPrezzo] = useState('');
    const [immagine, setImmagine] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCampo();
    }, [id]);

    const loadCampo = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/campi/${id}`, { headers });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || 'Errore caricamento campo');
            }

            setNome(data.nome);
            setDescrizione(data.descrizione || '');
            setCitta(data.citta);
            setIndirizzo(data.indirizzo || '');
            setPrezzo(data.prezzo || '');
            setImmagine(data.immagine || '');
        } catch (error) {
            console.error("Errore caricamento campo:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await onUpdateCampo(id, {
            nome,
            descrizione,
            citta,
            indirizzo,
            prezzo: prezzo ? Number(prezzo) : undefined,
            immagine
        });

        if (result.success) {
            navigate(`/campi/${id}`);
        } else {
            setError(result.message);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status"></div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Modifica Campo</h2>
                            
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
                                        placeholder="https://picsum.photos/400/300"
                                    />
                                </div>
                                
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-success">
                                        Salva Modifiche
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => navigate(`/campi/${id}`)}
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

export default EditCampo;