import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, toggleError] = useState(false);
    const { login } = useContext(AuthContext);

    async function handleSubmit(e) {
        e.preventDefault();
        toggleError(false);

        try {
            const result = await axios.post('http://localhost:8080/auth', {
                username: username,
                password: password,
            });

            login(result.data);

        } catch(e) {
            console.error(e);
            toggleError(true);
        }
    }

    return (
        <div className="signin outer-content-container">
            <div className="inner-content-container">
                <header>
                    <h1>Inloggen</h1>
                    <p>Welkom terug! Log in om je ritten te bekijken en te beheren. Op je persoonlijke dashboard kun je ook je profiel bijwerken, nieuwe ritten boeken en communiceren met andere gebruikers.</p>
                </header>

                <main>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username-field">
                            Gebruikersnaam:
                            <input
                                type="username"
                                id="username-field"
                                name="username"
                                value={username}
                                required
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </label>

                        <label htmlFor="password-field">
                            Wachtwoord:
                            <input
                                type="password"
                                id="password-field"
                                name="password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        {error && <p className="error">Combinatie van username en wachtwoord is onjuist</p>}

                        <button
                            type="submit"
                            className="form-button"
                        >
                            Inloggen
                        </button>
                    </form>
                </main>
                <aside>
                    <p>Heb je nog geen account? <Link to="/signup">Registreer</Link> je dan eerst.</p>
                </aside>
            </div>
        </div>
    );
}

export default SignIn;