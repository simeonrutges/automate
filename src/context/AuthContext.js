import React, { createContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import jwtDecode from "jwt-decode";

export const AuthContext = createContext({});

function AuthContextProvider({ children }) {
    const [auth, toggleAuth] = useState({
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
            toggleAuth({
                isAuth: false,
                user: null,
                status: 'done',
            });
        }
    }, []); // = mounting effect

    function login(JWT) {
        console.log(JWT)
        localStorage.setItem('token', JWT);
        const decoded = jwt_decode(JWT);
        console.log("decoded toke: ", decoded);

        // geef de ID, token en redirect-link mee aan de fetchUserData functie (staat hieronder)
        // fetchUserData(decoded.sub, JWT, '/profile');
        fetchUserData(decoded.sub, JWT, '/');
        // link de gebruiker door naar de profielpagina
        // history.push('/profile');
    }

    function logout() {
        localStorage.clear();
        toggleAuth({
            ...auth,
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
    //             ...auth,
    //             auth: true,
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
    //             auth: false,
    //             user: null,
    //             status: 'done',
    //         });
    //     }
    // }

    // Hieronder was de juiste 14/6!!!!!
//     async function fetchUserData(username, token, redirectUrl) {
//         try {
//             // haal gebruikersdata op met de token en id van de gebruiker
//             // const result = await axios.get(`http://localhost:3000/600/users/${id}`, {
//             const result = await axios.get(`http://localhost:8080/users/${username}`, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             console.log('Result:', result);
//
// /////// 1
//             const user = {
//                 username: result.data.username,
//                 email: result.data.email,
//                 id: result.data.username,
//                 roles: result.data.roles,
//                 password : result.data.password, //?14/6
//             };
//             console.log('User:', user);
//             // haal de rollen van de gebruiker op
//             // const roles = result.data.roles.map(role => role.rolename);
//             /////////////
//
//
//             // zet de gegevens in de state ---> deze is goed!!!
//             // toggleIsAuth({
//             //     ...auth,
//             //     auth: true,
//             //     user: {
//             //         username: result.data.username,
//             //         email: result.data.email,
//             //         id: result.data.username,
//             //     },
//             //     status: 'done',
//             // });
//
//             /////// 2
//             console.log(auth.user)
//             toggleAuth({
//                 ...auth, //? 14/6
//                 isAuth: true,
//                 user: {
//                     username: result.data.username,
//                     email: result.data.email,
//                     id: result.data.username,
//                     roles: result.data.roles,
//                     password : result.data.password, //?14/6
//                 },
//                 status: "done",
//                 isBestuurder: result.data.roles.includes("BESTUURDER"),
//                 isPassagier: result.data.roles.includes("PASSAGIER"),
//
//                 // Deze later proberen:
//                 // const roleNames = result.data.roles.map(role => role.rolename);
//                 // isBestuurder: roleNames.includes("BESTUURDER"),
//                 // isPassagier: roleNames.includes("PASSAGIER"),
//
//             });
//             /////////
//
//             // als er een redirect URL is meegegeven (bij het mount-effect doen we dit niet) linken we hiernnaartoe door
//             // als we de history.push in de login-functie zouden zetten, linken we al door voor de gebuiker is opgehaald!
//             if (redirectUrl) {
//                 history.push(redirectUrl);
//             }
//
//         } catch (e) {
//             console.error(e);
//             // ging er iets mis? Plaatsen we geen data in de state
//             toggleAuth({
//                 isAuth: false,
//                 user: null,
//                 status: 'done',
//                 ///////3  evt. weer weghalen
//                 isBestuurder: false,
//                 isPassagier: false,
//                 /////////
//             });
//
//         }
//     }

//nieuw ipv van hierboven: refresh on persist
    useEffect(()=> {
        console.log("De context is zojuist opnieuw opgestart")
        const token = localStorage.getItem("token");
        console.log("token:  ", token);

        if (token) {
            // geldig? zelf nog opzoeken! is de token nog geldig? -> decodeden en timestamp vergelijken met duidige datum
        const decodedToken = jwtDecode(token);
            const usernameToken = decodedToken.sub;
            console.log(usernameToken);

            // controleer of het token is verlopen
            const currentTime = Date.now().valueOf() / 1000;
            if (decodedToken.exp < currentTime) {
                console.log('Token is verlopen');
                // Omleiden naar inlogpagina
                history.push('/signin');
            } else {
                // token is nog geldig
                console.log('Token is geldig');
                const username = usernameToken;
                const redirectUrl = "/"; // vervang door een andere URL
                fetchUserData(username, token, redirectUrl);
            }

        } else {
            // Zo nee, doe niets, laat de state leeg
            toggleAuth({
                ...auth,
                status: 'done',
            });
        }
    },[]); // <-- mount effect

    async function fetchUserData(username, token, redirectUrl) {
        try {
            // haal gebruikersdata op met de token en id van de gebruiker
            const result = await axios.get(`http://localhost:8080/users/${username}`, {
                headers: {
                    "Content-Type": "application/json", // moet ik in mijn geval wel de content type meegeven?
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
                password: result.data.password, //?14/6
            };
            console.log('User:', user);
            // haal de rollen van de gebruiker op
            // const roles = result.data.roles.map(role => role.rolename);
            /////////////


            // zet de gegevens in de state ---> deze is goed!!!
            // toggleIsAuth({
            //     ...auth,
            //     auth: true,
            //     user: {
            //         username: result.data.username,
            //         email: result.data.email,
            //         id: result.data.username,
            //     },
            //     status: 'done',
            // });

            /////// 2
            console.log(auth.user)
            toggleAuth({
                ...auth, //? 14/6
                isAuth: true,
                user: {
                    username: result.data.username,
                    email: result.data.email,
                    id: result.data.username,
                    roles: result.data.roles,
                    password: result.data.password, //?14/6
                },
                status: "done",
                isBestuurder: result.data.roles.includes("BESTUURDER"),
                isPassagier: result.data.roles.includes("PASSAGIER"),

                // Deze later proberen:
                // const roleNames = result.data.roles.map(role => role.rolename);
                // isBestuurder: roleNames.includes("BESTUURDER"),
                // isPassagier: roleNames.includes("PASSAGIER"),

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
            toggleAuth({
                ...auth,
                isAuth: false,
                user: null,
                status: 'done',
                ///////3  evt. weer weghalen
                isBestuurder: false,
                isPassagier: false,
                /////////
            });

        }
    }

    const contextData = {
        isAuth: auth.isAuth,
        user: auth.user,
        login: login,
        logout: logout,
        ///// 3
        isBestuurder: auth.isBestuurder,
        isPassagier: auth.isPassagier,
        /////
    };

    return (
        <AuthContext.Provider value={contextData}>
            {auth.status === 'done' ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;