import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register({ onRegister }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ruolo, setRuolo] = useState('user');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await onRegister({ username, email, password, ruolo });
        
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || 'Errore durante la registrazione');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Registrati</h2>
                            
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength="6"
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Ruolo</label>
                                    <select 
                                        className="form-select"
                                        value={ruolo}
                                        onChange={(e) => setRuolo(e.target.value)}
                                    >
                                        <option value="user">Utente</option>
                                        <option value="gestore">Gestore</option>
                                    </select>
                                </div>
                                
                                <button type="submit" className="btn btn-primary w-100">
                                    Registrati
                                </button>
                            </form>
                            
                            <div className="text-center mt-3">
                                <Link to="/login">Hai già un account? Accedi</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;