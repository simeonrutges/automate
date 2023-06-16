import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import Modal from "../../context/modal/Modal";


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
            // log het resultaat in de console
            // console.log(result.data);
            // console.log(result.headers['authorization']);
            // console.log(result.headers.getAuthorization('authorization'));
            console.log("result: ", result.data);

            // geef de JWT token aan de login-functie van de context mee
            // login(result.data.accessToken);
            // login(result.headers['authorization'].substring(7));
            // login(result.headers.authorization.substring(7));
            login(result.data);

        } catch(e) {
            console.error(e);
            toggleError(true);
        }
    }

    return (
        <signin className="outer-content-container">
            <div className="inner-content-container">

        <div>
            <h1>Inloggen</h1>
            <p>Welkom terug! Log in om je ritten te bekijken en te beheren. Op je persoonlijke dashboard kun je ook je profiel bijwerken, nieuwe ritten boeken en communiceren met andere gebruikers.</p>

            <form onSubmit={handleSubmit}>
                <label htmlFor="username-field">
                    Gebruikersnaam:
                    <input
                        type="username"
                        id="username-field"
                        name="username"
                        value={username}
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

            <p>Heb je nog geen account? <Link to="/signup">Registreer</Link> je dan eerst.</p>
            <Modal message="Dit is de inlog pagina!"/>
        </div>

            </div>
        </signin>
    );
}

export default SignIn;