import React, { useState } from 'react';
import FormInput from '../../components/formInput/FormInput';
import axios from "axios";
import { useHistory } from "react-router-dom";
import '../signUp/signUp.css';

function SignUpTest() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

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
                roles: isChecked1 && isChecked2 ? ['BESTUURDER', 'PASSAGIER'] : isChecked1 ? ['BESTUURDER'] : isChecked2 ? ['PASSAGIER'] : []
            });
            console.log(result);

            // als alles goed gegaan is, linken we door naar de login-pagina
            history.push('/signin');
        } catch(e) {
            console.error(e);
            toggleError(true);
        }

        toggleLoading(false);
    }

    return (
        <form onSubmit={handleSubmit}>
            <FormInput id="email" labelText="Email:" inputType="email" value={email} onChange={handleEmailChange} />
            <FormInput id="username" labelText="Username:" inputType="text" value={username} onChange={handleUsernameChange} />
            <FormInput id="password" labelText="Password:" inputType="password" value={password} onChange={handlePasswordChange} />
            <FormInput id="firstname" labelText="Firstname:" inputType="text" value={firstname} onChange={handleFirstnameChange} />
            <FormInput id="lastname" labelText="Lastname:" inputType="text" value={lastname} onChange={handleLastnameChange} />
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
    );
}



export default SignUpTest;
