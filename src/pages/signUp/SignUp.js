import React, {useState} from "react";
import FormInput from "../../components/formInput/FormInput";
import axios from "axios";
import {useHistory} from "react-router-dom";
import "../signUp/signUp.css";

function SignUpTest() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // state voor radio-buttons
    const [role, setRole] = useState("");

    const [passwordError, setPasswordError] = useState("");
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
        const {value} = e.target;
        const phoneNumberPattern = /^[0-9]{10}$/;
        if (!phoneNumberPattern.test(value)) {
            toggleError('Vul een geldig telefoonnummer in zonder streepjes (-).');
        } else {
            toggleError(false);
        }
        setPhoneNumber(value);
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toggleError(false);
        toggleLoading(true);

        if (password.length < 8) {
            setPasswordError('Wachtwoord moet minimaal 8 tekens bevatten');
            toggleLoading(false);
            return;  // voorkomt dat de functie verder uitgevoerd wordt
        } else {
            setPasswordError(""); // clear error message if validation is passed
        }

        try {
            const result = await axios.post("http://localhost:8080/users", {
                password: password,
                username: username,
                firstname: firstname,
                lastname: lastname,
                email: email,
                phoneNumber: phoneNumber,
                roles: [role],
            });
            console.log(result);

            history.push("/signin");
        } catch (e) {
            console.error(e);
            toggleError(true);
        }

        toggleLoading(false);
    };

    return (
        <signup className="outer-content-container">
            <div className="inner-content-container">
                <h1>Aanmelden</h1>
                <p>
                    Registreer je nu als AutoMate gebruiker! Vul hieronder je persoonlijke
                    gegevens in en kies of je als bestuurder of passagier wilt deelnemen
                    aan de carpoolcommunity. Samen kunnen we files verminderen en duurzamer
                    reizen!
                </p>

                <form onSubmit={handleSubmit}>
                    <FormInput
                        id="username"
                        labelText="Gebruikersnaam:"
                        inputType="text"
                        value={username}
                        required
                        onChange={handleUsernameChange}
                    />
                    <FormInput
                        id="password"
                        labelText="Wachtwoord (min. 8 tekens):"
                        inputType="password"
                        value={password}
                        required
                        onChange={handlePasswordChange}
                    />
                    {passwordError && <div className="error-message">{passwordError}</div>}
                    <FormInput
                        id="firstname"
                        labelText="Voornaam:"
                        inputType="text"
                        value={firstname}
                        required
                        onChange={handleFirstnameChange}
                    />
                    <FormInput
                        id="lastname"
                        labelText="Achternaam:"
                        inputType="text"
                        value={lastname}
                        required
                        onChange={handleLastnameChange}
                    />
                    <FormInput
                        id="email"
                        labelText="Email:"
                        inputType="email"
                        value={email}
                        required
                        onChange={handleEmailChange}
                    />
                    <FormInput
                        id="phoneNumber"
                        labelText="Telefoon:"
                        inputType="tel"
                        value={phoneNumber}
                        required
                        onChange={handlePhoneNumberChange}
                    />
                    {error && <div className="error-message">{error}</div>}

                    <section id="radio-section">
                        <div className="radio">
                            <label htmlFor="driver-radio">
                                Bestuurder
                                <input
                                    type="radio"
                                    id="driver-radio"
                                    value="BESTUURDER"
                                    name="role"
                                    checked={role === "BESTUURDER"}
                                    onChange={handleRoleChange}
                                    required
                                />
                            </label>
                        </div>
                        <div className="radio passenger-radio">
                            <label htmlFor="passenger-radio">
                                Passagier
                                <input
                                    type="radio"
                                    id="passenger-radio"
                                    value="PASSAGIER"
                                    name="role"
                                    checked={role === "PASSAGIER"}
                                    onChange={handleRoleChange}
                                />
                            </label>
                        </div>
                    </section>


                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </signup>
    );
}

export default SignUpTest;

