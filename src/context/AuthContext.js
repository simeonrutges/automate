import React, { createContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

export const AuthContext = createContext({});

function AuthContextProvider({ children }) {
    const [isAuth, toggleIsAuth] = useState({
        //  de "verzamelbak"
        isAuth: false,
        user: null,
        status: 'pending',
        // dit is de state voor de dynamische comp. uit de het context objecT)
        ///// 0
        isBestuurder: false,
        isPassagier: false,
        //////
    });
    const history = useHistory();

    // MOUNTING EFFECT
    useEffect(() => {
        // haal de JWT op uit Local Storage
        const token = localStorage.getItem('token');

        // als er WEL een token is, haal dan opnieuw de gebruikersdata op
        if (token) {
            const decoded = jwt_decode(token);
            fetchUserData(decoded.sub, token);
        } else {
            // als er GEEN token is doen we niks, en zetten we de status op 'done'
            toggleIsAuth({
                isAuth: false,
                user: null,
                status: 'done',
            });
        }
    }, []); // = mounting effect

    function login(JWT) {
        // zet de token in de Local Storage
        localStorage.setItem('token', JWT);
        // decode de token zodat we de ID van de gebruiker hebben en data kunnen ophalen voor de context
        const decoded = jwt_decode(JWT);

        // geef de ID, token en redirect-link mee aan de fetchUserData functie (staat hieronder)
        // fetchUserData(decoded.sub, JWT, '/profile');
        fetchUserData(decoded.sub, JWT, '/');
        // link de gebruiker door naar de profielpagina
        // history.push('/profile');
    }

    function logout() {
        localStorage.clear();
        toggleIsAuth({
            isAuth: false,
            user: null,
            status: 'done',
        });

        console.log('Gebruiker is uitgelogd!');
        history.push('/');
    }

    // Omdat we deze functie in login- en het mounting-effect gebruiken, staat hij hier gedeclareerd!
    // async function fetchUserData(id, token, redirectUrl) {
    //     try {
    //         // haal gebruikersdata op met de token en id van de gebruiker
    //         // const result = await axios.get(`http://localhost:3000/600/users/${id}`, {
    //         const result = await axios.get(`http://localhost:8080/users/${id}`, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //
    //         // zet de gegevens in de state
    //         toggleIsAuth({
    //             ...isAuth,
    //             isAuth: true,
    //             user: {
    //                 username: result.data.username,
    //                 email: result.data.email,
    //                 id: result.data.id,
    //             },
    //             status: 'done',
    //         });
    //
    //         // als er een redirect URL is meegegeven (bij het mount-effect doen we dit niet) linken we hiernnaartoe door
    //         // als we de history.push in de login-functie zouden zetten, linken we al door voor de gebuiker is opgehaald!
    //         if (redirectUrl) {
    //             history.push(redirectUrl);
    //         }
    //
    //     } catch (e) {
    //         console.error(e);
    //         // ging er iets mis? Plaatsen we geen data in de state
    //         toggleIsAuth({
    //             isAuth: false,
    //             user: null,
    //             status: 'done',
    //         });
    //     }
    // }

    // Dit is de juiste: = werkt nu met Roles!
    async function fetchUserData(username, token, redirectUrl) {
        try {
            // haal gebruikersdata op met de token en id van de gebruiker
            // const result = await axios.get(`http://localhost:3000/600/users/${id}`, {
            const result = await axios.get(`http://localhost:8080/users/${username}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Result:', result);

/////// 1
            const user = {
                username: result.data.username,
                email: result.data.email,
                id: result.data.username,
                roles: result.data.roles,
            };
            console.log('User:', user);
            // haal de rollen van de gebruiker op
            // const roles = result.data.roles.map(role => role.rolename);
            /////////////


            // zet de gegevens in de state ---> deze is goed!!!
            // toggleIsAuth({
            //     ...isAuth,
            //     isAuth: true,
            //     user: {
            //         username: result.data.username,
            //         email: result.data.email,
            //         id: result.data.username,
            //     },
            //     status: 'done',
            // });

            /////// 2
            console.log(isAuth.user)
            toggleIsAuth({
                isAuth: true,
                user: {
                    username: result.data.username,
                    email: result.data.email,
                    id: result.data.username,
                    roles: result.data.roles,
                },
                status: "done",
                isBestuurder: result.data.roles.some(role => role.rolename === "BESTUURDER"),
                isPassagier: result.data.roles.some(role => role.rolename === "PASSAGIER"),
            });
            /////////

            // als er een redirect URL is meegegeven (bij het mount-effect doen we dit niet) linken we hiernnaartoe door
            // als we de history.push in de login-functie zouden zetten, linken we al door voor de gebuiker is opgehaald!
            if (redirectUrl) {
                history.push(redirectUrl);
            }

        } catch (e) {
            console.error(e);
            // ging er iets mis? Plaatsen we geen data in de state
            toggleIsAuth({
                isAuth: false,
                user: null,
                status: 'done',
                ///////3  evt. weer weghalen
                isBestuurder: false,
                isPassagier: false,
                /////////
            });


    // deze als test via chatGpt:
    // async function fetchUserData(username, token, redirectUrl) {
    //     try {
    //         // haal gebruikersdata op met de token en id van de gebruiker
    //         const userResult = await axios.get(`http://localhost:8080/users/${username}`, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //
    //         // zet de gegevens in de state
    //         toggleIsAuth({
    //             ...isAuth,
    //             isAuth: true,
    //             user: {
    //                 username: userResult.data.username,
    //                 email: userResult.data.email,
    //                 id: userResult.data.username,
    //                 roles: userResult.data.roles, // voeg de rollen toe aan de gebruikersgegevens -> deze erbij gezet
    //             },
    //             status: 'done',
    //         });
    //
    //         // als er een redirect URL is meegegeven (bij het mount-effect doen we dit niet) linken we hiernnaartoe door
    //         // als we de history.push in de login-functie zouden zetten, linken we al door voor de gebuiker is opgehaald!
    //         if (redirectUrl) {
    //             history.push(redirectUrl);
    //         }
    //
    //     } catch (e) {
    //         console.error(e);
    //         // ging er iets mis? Plaatsen we geen data in de state
    //         toggleIsAuth({
    //             isAuth: false,
    //             user: null,
    //             status: 'done',
    //         });
    //         // tot hier test


        }
    }



////////
    const contextData = {
        isAuth: isAuth.isAuth,
        user: isAuth.user,
        login: login,
        logout: logout,
        ///// 3
        isBestuurder: isAuth.isBestuurder,
        isPassagier: isAuth.isPassagier,
        /////
    };

    return (
        <AuthContext.Provider value={contextData}>
            {isAuth.status === 'done' ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;