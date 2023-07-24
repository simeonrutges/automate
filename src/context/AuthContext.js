import React, { createContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import jwtDecode from "jwt-decode";

export const AuthContext = createContext({});

function AuthContextProvider({ children }) {
    const [auth, toggleAuth] = useState({
        isAuth: false,
        user: null,
        status: 'pending',
        isBestuurder: false,
        isPassagier: false,
    });
    const history = useHistory();

    // MOUNTING EFFECT
    useEffect(() => {

        const token = localStorage.getItem('token');

        if (token) {
            const decoded = jwt_decode(token);
            fetchUserData(decoded.sub, token);
        } else {

            toggleAuth({
                isAuth: false,
                user: null,
                status: 'done',
            });
        }
    }, []);

    function login(JWT) {
        localStorage.setItem('token', JWT);
        const decoded = jwt_decode(JWT);

        fetchUserData(decoded.sub, JWT, '/');

    }

    function logout() {
        localStorage.clear();
        toggleAuth({
            ...auth,
            isAuth: false,
            user: null,
            status: 'done',
        });

        history.push('/');
    }

    useEffect(()=> {
        const token = localStorage.getItem("token");

        if (token) {
        const decodedToken = jwtDecode(token);
            const usernameToken = decodedToken.sub;


            // controleer of het token is verlopen
            const currentTime = Date.now().valueOf() / 1000;
            if (decodedToken.exp < currentTime) {

                history.push('/signin');
            } else {

                const username = usernameToken;
                const redirectUrl = "/";
                fetchUserData(username, token, redirectUrl);
            }

        } else {
            toggleAuth({
                ...auth,
                status: 'done',
            });
        }
    },[]);

    async function fetchUserData(username, token, redirectUrl) {
        try {
            const result = await axios.get(`http://localhost:8080/users/${username}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const user = {
                username: result.data.username,
                email: result.data.email,
                id: result.data.username,
                roles: result.data.roles,
                password: result.data.password,
            };

            toggleAuth({
                ...auth,
                isAuth: true,
                user: {
                    username: result.data.username,
                    email: result.data.email,
                    id: result.data.username,
                    roles: result.data.roles,
                    password: result.data.password,
                },
                status: "done",
                isBestuurder: result.data.roles.includes("BESTUURDER"),
                isPassagier: result.data.roles.includes("PASSAGIER"),


            });

            if (redirectUrl) {
                history.push(redirectUrl);
            }

        } catch (e) {
            console.error(e);

            toggleAuth({
                ...auth,
                isAuth: false,
                user: null,
                status: 'done',

                isBestuurder: false,
                isPassagier: false,

            });

        }
    }

    const contextData = {
        isAuth: auth.isAuth,
        user: auth.user,
        login: login,
        logout: logout,

        isBestuurder: auth.isBestuurder,
        isPassagier: auth.isPassagier,

    };

    return (
        <AuthContext.Provider value={contextData}>
            {auth.status === 'done' ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;