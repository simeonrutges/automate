import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {useHistory} from "react-router-dom";
import axios from "axios";
import './profile.css';

function Profile() {
    const [profileData, setProfileData] = useState({});
    const {user} = useContext(AuthContext);
    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);

    const [bio, setBio] = useState("");

    const [licensePlate, setLicensePlate] = useState('');
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');



    const history = useHistory();
    const token = localStorage.getItem("token");
    const username = user.username;

    useEffect(() => {
        async function fetchProfileData() {
            try {
                const result = await axios.get(`http://localhost:8080/users/${username}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (result.data && result.data.username) {
                    setProfileData(result.data);
                } else {
                    console.error("Ongeldige response van de server");
                }
            } catch (e) {
                console.error(e);
            }
        }

        fetchProfileData();
    }, [username]);

    const handleBioSubmit = async (e) => {
        e.preventDefault();
        toggleError(false);
        toggleLoading(true);

        try {
            const result = await axios.put(
                `http://localhost:8080/users/${username}`,
                {
                    bio: bio,
                    username: profileData.username,
                    password: profileData.password,
                    firstname: profileData.firstname,
                    lastname: profileData.lastname,
                    email: profileData.email,
                    phoneNumber: profileData.phoneNumber,
                    enabled: profileData.enabled,
                    roles: profileData.roles,
                }
            );

            if (result.data && result.data.username) {
                setProfileData(result.data);
            } else {
                console.error("Ongeldige response van de server");
            }
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
            const result = await axios.put(
                `http://localhost:8080/users/${username}`,
                {
                    bio: null,
                    username: profileData.username,
                    password: profileData.password,
                    firstname: profileData.firstname,
                    lastname: profileData.lastname,
                    email: profileData.email,
                    phoneNumber: profileData.phoneNumber,
                    enabled: profileData.enabled,
                    roles: profileData.roles,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProfileData({...profileData, bio: null});
            setBio(""); // Reset bio state to clear the textarea
        } catch (e) {
            console.error(e);
            toggleError(true);
        }

        toggleLoading(false);
    }

        ///////
        async function handleVehicleSubmit(event) {
            event.preventDefault();

            try {
                const result = await axios.post('http://localhost:8080/cars', {
                    licensePlate: licensePlate,
                    model: model,
                    brand: brand,
                });

                // Handle the response data (result.data) as needed

                // Clear the input fields after successful submission
                setLicensePlate('');
                setModel('');
                setBrand('');

            } catch (error) {
                console.error('Error submitting the vehicle data:', error);
            }


    };

    return (
        <div className="outer-content-container">
            <div className="inner-content-container">
                <div>
                    <h1>Mijn Profiel</h1>
                    <section className="profile-picture">
                        <section className="foto-name">
                            <h4>FOTO</h4>
                            <h4>{user.username}</h4>
                        </section>
                    </section>

                    {Object.keys(profileData).length > 0 && (
                        <section className="bio">
                            <h2>Strikt geheime profiel-content</h2>
                            <p>Rol: {profileData.roles}</p>
                            <p>Voornaam: {profileData.firstname}</p>
                            <p>Achternaam: {profileData.lastname}</p>
                            <p>Telefoon:{profileData.phoneNumber}</p>
                            <p>Email: {profileData.email}</p>

                            {profileData.bio ? (
                                <div>
                                    <h6>Biografie</h6>
                                    <p>{profileData.bio}</p>
                                    <button onClick={handleDeleteBio}>Verwijder</button>
                                </div>
                            ) : (
                                <div>
                                    <form className="bio-form" onSubmit={handleBioSubmit}>
                                        <label className="bio-label" htmlFor="bio-field">
                                            <p className="bio-text">Biografie toevoegen</p>
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
                                        <button type="submit" className="form-button">
                                            Opslaan
                                        </button>
                                    </form>
                                </div>
                            )}
                        </section>
                    )}

                    <section className="vehicle-submit">
                        <form onSubmit={handleVehicleSubmit}>
                            <label htmlFor="licensePlate-field">Voertuig toevoegen</label>
                            <input
                                placeholder="Kenteken"
                                type="text"
                                id="licensePlate-field"
                                value={licensePlate}
                                onChange={(e) => setLicensePlate(e.target.value)}
                            />

                            <label htmlFor="model-field">Model</label>
                            <input
                                placeholder="Model"
                                type="text"
                                id="model-field"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                            />

                            <label htmlFor="brand-field">Merk</label>
                            <input
                                placeholder="Merk"
                                type="text"
                                id="brand-field"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            />

                            <button type="submit">Voertuig toevoegen</button>
                        </form>



                    </section>
                </div>
            </div>
        </div>
    );
}

export default Profile;



