import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import {getRoles} from "@testing-library/react";
import  './signUp.css';
import FormInput from "../../components/formInput/FormInput";

function SignUp() {
    // state voor het formulier
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    // state voor checkbox
    const [roles, setRoles] = useState('');
    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);



    // state voor functionaliteit
    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(e) {
        // Zorgt ervoor dat de pagina niet refresht wanneer dit gebeurt
        e.preventDefault();
        console.log(email, username, password, firstname, lastname, roles);
        toggleError(false);
        toggleLoading(true);

        try {
            const result = await axios.post('http://localhost:8080/users', {

                password: password,
                username: username,
                firstname: firstname,
                lastname: lastname,
                email: email,
                roles: isChecked1 && isChecked2 ? ['BESTUURDER', 'PASSAGIER'] : isChecked1 ? ['BESTUURDER'] : isChecked2 ? ['PASSAGIER'] : []
            });
            console.log(result);

            // Let op: omdat we geen axios Canceltoken gebruiken zul je hier een memory-leak melding krijgen.
            // Om te zien hoe je een canceltoken implementeerd kun je de bonus-branch bekijken!

            // als alles goed gegaan is, linken we dyoor naar de login-pagina
            history.push('/signin');
        } catch(e) {
            console.error(e);
            toggleError(true);
        }

        toggleLoading(false);
    }

    return (
        <signup className="outer-content-container">
            <div className="inner-content-container">

        <div>
            <h1>Aanmelden</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur atque consectetur, dolore eaque eligendi
                harum, numquam, placeat quisquam repellat rerum suscipit ullam vitae. A ab ad assumenda, consequuntur deserunt
                doloremque ea eveniet facere fuga illum in numquam quia reiciendis rem sequi tenetur veniam?
            </p>

            
            <form onSubmit={handleSubmit}>

                <label htmlFor="password-field">
                    Voornaam:
                    <input
                        type="text"
                        id="firstname-field"
                        name="firstname"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                </label>

                <label htmlFor="password-field">
                    Achternaam:
                    <input
                        type="text"
                        id="lastname-field"
                        name="lastname"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                    />
                </label>

                <label htmlFor="username-field">
                    Gebruikersnaam:
                    <input
                        type="text"
                        id="username-field"
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

                <label htmlFor="email-field">
                    Email:
                    <input
                        type="email"
                        id="email-field"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>

                    <label htmlFor="driver-checkbox" className="checkbox">
                        Bestuurder
                        <input
                            type="checkbox"
                            id="driver-checkbox"
                            value="BESTUURDER"
                            name="role"
                            checked={isChecked1}
                            onChange={(e) => setIsChecked1(e.target.checked)}
                        />
                    </label>
                    <label htmlFor="passenger-checkbox" className="checkbox">
                        Passagier
                        <input
                            type="checkbox"
                            id="passenger-checkbox"
                            value="PASSAGIER"
                            name="role"
                            checked={isChecked2}
                            onChange={(e) => setIsChecked2(e.target.checked)}
                        />
                    </label>

                {error && <p className="error">Dit account bestaat al. Probeer een ander emailadres.</p>}
                <button
                    type="submit"
                    className="form-button"
                    disabled={loading}
                >
                    Registreren
                </button>

            </form>

            <p>Heb je al een account? Je kunt je <Link to="/signin">hier</Link> inloggen.</p>
        </div>

            </div>
        </signup>
    );
}

export default SignUp;