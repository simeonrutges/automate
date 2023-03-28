import React, {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import  './profile.css';

function Profile() {
    const [profileData, setProfileData] = useState({});

    const {user} = useContext(AuthContext);

    // useEffect(() => {
    //     // we halen de pagina-content op in de mounting-cycle
    //     async function fetchProfileData() {
    //         // haal de token uit de Local Storage om in het GET-request te bewijzen dat we geauthoriseerd zijn
    //         const token = localStorage.getItem('token');
    //
    //         try {
    //             const result = await axios.get('http://localhost:8080/users', {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             });
    //             console.log(result.data)
    //             setProfileData(result.data);
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     }
    //
    //     fetchProfileData();
    // }, [])

    // Deze heb ik bijgevoegd om te proberen/bovenstaand was goed!:
    const username = user.username;

    useEffect(() => {
        async function fetchProfileData() {
            const token = localStorage.getItem('token');
            // const username = ''; // vervang dit door de daadwerkelijke gebruikersnaam


            try {
                console.log(username);
                const result = await axios.get(`http://localhost:8080/users/${username}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(result);

                // controleer of de response het verwachte formaat heeft
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
    }, []);
    //////////////////////////
    const [bio, setBio] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('')

    function handleSubmit(event) {
        event.preventDefault();
        console.log(`Bio: ${bio}`);
        console.log(`Voertuig: ${vehicle}`);
        // voeg hier de code toe om de biografie en het voertuig op te slaan
    }



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


                        </section>
                    }


                    <div>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="bio-field">
                                Biografie toevoegen
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

                            <label htmlFor="licensePlate-field">Voertuig toevoegen</label>
                            <input
                                placeholder="Kenteken"
                                type="text"
                                id="licensePlate-field"
                                value={licensePlate}
                                onChange={(e) => setLicensePlate(e.target.value)}
                            />

                            <label htmlFor="model-field"></label>
                            <input
                                placeholder="Model"
                                type="text"
                                id="model-field"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                            />

                            <label htmlFor="brand-field"></label>
                            <input
                                placeholder="Merk"
                                type="text"
                                id="brand-field"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            />

                            <button
                                type="submit"
                                className="form-button"
                            >
                                Opslaan
                            </button>
                        </form>
                    </div>


                    <p>Terug naar de <Link to="/">Homepagina</Link></p>
                </div>


            </div>
        </profile>
    );
}

export default Profile;