import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {useHistory} from "react-router-dom";
import axios from "axios";

function Profile() {
    const [profileData, setProfileData] = useState({});

    const {user} = useContext(AuthContext);

    // state voor functionaliteit
    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);


    const history = useHistory();

    const username = user.username;

    useEffect(() => {
        async function fetchProfileData() {
            const token = localStorage.getItem('token');

            try {
                const result = await axios.get(`http://localhost:8080/users/${username}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(result);

                if (result.data && result.data.username) {
                    setProfileData(result.data);
                } else {
                    console.error('Ongeldige response van de server');
                }
            } catch (e) {
                console.error(e);
            }
        }

        fetchProfileData();
    }, [username]);

    const [bio, setBio] = useState('');

    const [showEditForm, setShowEditForm] = useState(false);

    const handleEditBio = async (event) => {
        event.preventDefault();
        toggleError(false);
        toggleLoading(true);

        try {
            const token = localStorage.getItem('token');

            const result = await axios.put(`http://localhost:8080/users/${username}`, {
                bio: bio,
                username: profileData.username,
                password: profileData.password,
                firstname: profileData.firstname,
                lastname: profileData.lastname,
                email: profileData.email,
                phoneNumber: profileData.phoneNumber,
                enabled: profileData.enabled,
                roles: profileData.roles,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(result);

            setProfileData({...profileData, bio: bio});
            setShowEditForm(false);
        } catch (e) {
            console.error(e);
            toggleError(true);
        }

        toggleLoading(false);
    };

    const handleDeleteBio = async () => {
        toggleError(false);
        toggleLoading(true);

        try {
            const token = localStorage.getItem('token');

            const result = await axios.put(`http://localhost:8080/users/${username}`, {
                bio: null,
                username: profileData.username,
                password: profileData.password,
                firstname: profileData.firstname,
                lastname: profileData.lastname,
                email: profileData.email,
                phoneNumber: profileData.phoneNumber,
                enabled: profileData.enabled,
                roles: profileData.roles,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(result);

            setProfileData({...profileData, bio: null});
        } catch (e) {
            console.error(e);
            toggleError(true);
        }

        toggleLoading(false);
    };

    return (
<profile className="outer-content-container">
    <div className="inner-content-container">
        <div>
            <h1>Mijn Profiel</h1>
            <div>
                <section className="foto-name">
                    <h4>FOTO</h4>
                    <h4>{user.username}</h4>
                </section>
            </div>
            {/*Als er keys in ons object zitten hebben we data, en dan renderen we de content*/}
            {Object.keys(profileData).length > 0 &&
                <section>
                    <h2>Strikt geheime profiel-content</h2>
                    <p>Rol: {profileData.roles}</p>
                    <p>Voornaam: {profileData.firstname}</p>
                    <p>Achternaam: {profileData.lastname}</p>
                    <p>Telefoon:{profileData.phoneNumber}</p>
                    <p>Email: {profileData.email}</p>
                    {/* Toon de bio als deze bestaat */}
                    {profileData.bio && (
                        <div>
                            <h6>Biografie</h6>
                            <p>{profileData.bio}</p>
                            <button onClick={() => setShowEditForm(true)}>Pas aan</button>
                            <button onClick={handleDeleteBio}>Verwijder</button>
                        </div>
                    )}
                    {/* Toon een leeg veld als er geen bio is */}
                    {!profileData.bio && (
                        <div>
                            {/*<h6>Biografie</h6>*/}
                            {/*<p>Geen biografie gevonden</p>*/}
                            <h6>Biografie</h6>
                            <button onClick={() => setShowEditForm(true)}>Toevoegen</button>
                        </div>
                    )}
                    {/* Toon het bewerkingsformulier als ShowEditForm true is */}
                    {showEditForm && (
                        <div>
                            <form onSubmit={handleEditBio}>
                                <label htmlFor="bio-field">
                                    Biografie bewerken
                                    <textarea
                                        cols="30"
                                        rows="10"
                                        placeholder="Wie ben ik?"
                                        id="bio-field"
                                        name="bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                    />
                                </label>
                                <button type="submit">Opslaan</button>
                                <button onClick={() => setShowEditForm(false)}>Annuleren</button>
                            </form>
                        </div>
                    )}
                </section>
            }
        </div>
    </div>
</profile>
    );
}

    export default Profile;