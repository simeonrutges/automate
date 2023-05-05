import React, {useState} from 'react';
import FormInput from '../../components/formInput/FormInput';
import axios from "axios";
import {useHistory} from "react-router-dom";
import '../signUp/signUp.css';

function SignUpTest() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // state voor checkbox
    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);

    // state voor functionaliteit
    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);

    const history = useHistory();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleFirstnameChange = (e) => {
        setFirstname(e.target.value);
    };

    const handleLastnameChange = (e) => {
        setLastname(e.target.value);
    };

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toggleError(false);
        toggleLoading(true);

        try {
            const result = await axios.post('http://localhost:8080/users', {
                password: password,
                username: username,
                firstname: firstname,
                lastname: lastname,
                email: email,
                phoneNumber: phoneNumber,
                roles: isChecked1 && isChecked2 ? ['BESTUURDER', 'PASSAGIER'] : isChecked1 ? ['BESTUURDER'] : isChecked2 ? ['PASSAGIER'] : []
            });
            console.log(result);

            // als alles goed gegaan is, linken we door naar de login-pagina
            history.push('/signin');
        } catch (e) {
            console.error(e);
            toggleError(true);
        }

        toggleLoading(false);
    }

    return (
        <signup className="outer-content-container">
            <div className="inner-content-container">

                <h1>Aanmelden</h1>
                <p>Registreer je nu als AutoMate gebruiker! Vul hieronder je persoonlijke gegevens in en kies of je als bestuurder of passagier wilt deelnemen aan de carpoolcommunity. Samen kunnen we files verminderen en duurzamer reizen!
                </p>

                <form onSubmit={handleSubmit}>
                    <FormInput id="username" labelText="Gebruikersnaam:" inputType="text" value={username}
                               onChange={handleUsernameChange}/>
                    <FormInput id="password" labelText="Wachtwoord:" inputType="password" value={password}
                               onChange={handlePasswordChange}/>
                    <FormInput id="firstname" labelText="Voornaam:" inputType="text" value={firstname}
                               onChange={handleFirstnameChange}/>
                    <FormInput id="lastname" labelText="Achternaam:" inputType="text" value={lastname}
                               onChange={handleLastnameChange}/>
                    <FormInput id="email" labelText="Email:" inputType="email" value={email}
                               onChange={handleEmailChange}/>
                    <FormInput id="phoneNumber" labelText="Telefoon:" inputType="tel" value={phoneNumber}
                               onChange={handlePhoneNumberChange}/>
                    <label htmlFor="driver-checkbox" className="checkbox">
                        <input
                            type="checkbox"
                            id="driver-checkbox"
                            value="BESTUURDER"
                            name="role"
                            checked={isChecked1}
                            onChange={(e) => setIsChecked1(e.target.checked)}
                        />
                        Bestuurder
                    </label>
                    <label htmlFor="passenger-checkbox" className="checkbox">
                        <input
                            type="checkbox"
                            id="passenger-checkbox"
                            value="PASSAGIER"
                            name="role"
                            checked={isChecked2}
                            onChange={(e) => setIsChecked2(e.target.checked)}
                        />
                        Passenger
                    </label>
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </signup>
    );
}


export default SignUpTest;
