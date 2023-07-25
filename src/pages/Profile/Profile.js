import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";
import './profile.css';
import standard_profile_img from '../../assets/sustainability.jpg';
import FileUploadForm from './FileUploadForm';

function Profile() {
    const {username: viewedUsername} = useParams();
    const history = useHistory();

    const [profileData, setProfileData] = useState({});
    const {user} = useContext(AuthContext);
    const username = viewedUsername ? viewedUsername : user.username;

    const token = localStorage.getItem("token");

    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const [fetchProfileDataError, setFetchProfileDataError] = useState('');
    const [toggle, setToggle] = useState(false);

    const [uploadedImage, setUploadedImage] = useState(null);
    const [bio, setBio] = useState("");
    const [licensePlate, setLicensePlate] = useState('');
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [carData, setCarData] = useState({});

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

                setFetchProfileDataError(e.response.status);
            }
        }

        fetchProfileData();
    }, [username, toggle]);

    async function handleBioSubmit(e) {
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
                    fileName: profileData.fileName,
                    docFile: profileData.docFile,
                    car: {
                        id: carData.id,
                        licensePlate: carData.licensePlate,
                        model: carData.model,
                        brand: carData.brand,
                    }
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                });

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

    async function handleDeleteBio() {
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
                    fileName: profileData.fileName,
                    docFile: profileData.docFile,
                    car: carData,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProfileData({...profileData, bio: null});
            setBio("");
        } catch (e) {
            console.error(e);
            toggleError(true);
        }

        toggleLoading(false);
    }

    async function handleVehicleSubmit(e) {
        e.preventDefault();

        try {
            const result = await axios.post('http://localhost:8080/cars', {
                licensePlate: licensePlate,
                model: model,
                brand: brand,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            setCarData(result.data);

        } catch (error) {
            console.error('Error submitting the vehicle data:', error);
        }
    }

    async function handleDeleteVehicle() {
        setLicensePlate('');
        setModel('');
        setBrand('');
        setCarData({});
        try {
            await axios.delete(`http://localhost:8080/cars/${carData.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },

            });
        } catch (error) {
            console.error('Error deleting the vehicle:', error);
        }
    }

    useEffect(() => {
        async function fetchProfileImage() {

            if (profileData.fileName) {
                try {
                    const response = await axios.get(`http://localhost:8080/users/downloadFromDB/${profileData.fileName}`, {
                        responseType: 'blob',
                        headers: {'Authorization': `Bearer ${token}`}
                    });

                    const image = URL.createObjectURL(response.data);
                    setUploadedImage(image);
                } catch (error) {
                    console.error('Error fetching profile image:', error);
                }
            }
        }

        fetchProfileImage();
    }, [profileData]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/users/deleteProfileImage/${username}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setUploadedImage(null);
        } catch (error) {
            console.error('Error deleting profile image:', error);
        }
    };

    async function fetchCarData() {
        try {
            const response = await axios.get(`http://localhost:8080/cars/user/${username}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data) {
                setCarData(response.data);
            } else {
                console.error("Ongeldige response van de server");
            }
        } catch (error) {
            console.error('Error fetching car data:', error);
        }
    }

    useEffect(() => {
        fetchCarData();
    }, [username]);

    // button
    const handleSendMessage = () => {
        // Navigeer naar de nieuwe pagina (bijv. '/nieuw-bericht') wanneer er op de knop wordt geklikt
        history.push(`/my-messages/${username}`);
    };

    return (
        <div className="outer-content-container">
            <div className="inner-content-container">
                <div>
                    <header>
                        {user.username === username ? (
                            <h1>Mijn Profiel</h1>
                        ) : (
                            <h1>{username}'s profiel</h1>
                        )}
                        <figure className="profile-picture">
                            <section className="foto-name">

                                {uploadedImage ? (
                                    <div className="file-upload-container">
                                        <img src={uploadedImage} alt="Profielfoto" className="image-upload"/>
                                        {user.username === username && (
                                            <button onClick={handleDelete} className="delete-button">Verwijder</button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="file-upload-container">
                                        {user.username === username && (
                                            <FileUploadForm
                                                username={username}
                                                setToggle={setToggle}
                                                toggle={toggle}
                                                standardImg={standard_profile_img}
                                            />
                                        )}
                                        {user.username !== username && (
                                            <img src={standard_profile_img} alt="Standaard profielfoto"
                                                 className="image-upload"/>
                                        )}
                                    </div>
                                )}
                                <h2 id="myHeader">{username}</h2>
                            </section>
                        </figure>
                    </header>

                    {Object.keys(profileData).length > 0 && (
                        <main className="main-content main-section">
                            <section className="contact-section">

                                <h4>Contactgegevens</h4>
                                <div className="contact-details">
                                    <p>Rijstatus: {profileData.roles}</p>
                                    <p>Voornaam: {profileData.firstname}</p>
                                    <p>Achternaam: {profileData.lastname}</p>
                                    <p>Telefoon:
                                        0{profileData.phoneNumber}</p>{/*in volgende versie 'tel' veranderen naar String en '0' verwijderen*/}
                                    <p>Email: {profileData.email}</p>
                                </div>

                                {user.username !== username && (
                                    <button onClick={handleSendMessage}>Stuur {profileData.firstname} een
                                        bericht</button>
                                )}

                            </section>

                            <section className="bio-section">
                                {user.username === username && !profileData.bio && (
                                    <h4>Bio</h4>
                                )}

                                {profileData.bio ? (

                                    <div>

                                        {user.username === username ? (
                                            <h4>Over mij</h4>
                                        ) : (
                                            <h4>Over {username}</h4>
                                        )}
                                        <p>{profileData.bio}</p>
                                        {user.username === username && (
                                            <button onClick={handleDeleteBio}>Verwijder</button>
                                        )}
                                    </div>
                                ) : (

                                    <div>

                                        {user.username === username && (
                                            <form className="bio-form" onSubmit={handleBioSubmit}>
                                                <label className="bio-label" htmlFor="bio-field">
                                                    <p className="bio-text">Over mij</p>
                                                    <textarea
                                                        cols="30"
                                                        rows="10"
                                                        placeholder="Beschrijf jezelf kort. Welke interesses heb je? Luister je graag naar muziek of podcasts tijdens het rijden, of geef je de voorkeur aan stilte? Hebben je speciale reisregels? Ben je een fan van koffiepauzes of houd je van de schoonheid van de vroege ochtend? Laat weten dat iedere reis met jou een avontuur is!"
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
                                        )}

                                    </div>

                                )}
                            </section>

                            {profileData.roles && profileData.roles.includes('BESTUURDER') && (

                                <section className="vehicle-submit-section">
                                    {Object.keys(carData).length === 0 && user.username === username ? (
                                        <div>
                                            <h4>Voertuig toevoegen</h4>
                                            <form className="vehicle-form" onSubmit={handleVehicleSubmit}>
                                                <label htmlFor="licensePlate-field">Kenteken</label>
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
                                        </div>
                                    ) : (
                                        carData && carData.licensePlate && carData.model && carData.brand && (
                                            <div>
                                                {user.username === username ? (
                                                    <h4>Mijn auto</h4>
                                                ) : (
                                                    <h4>Auto</h4>
                                                )}

                                                <p>Kenteken: {carData.licensePlate}</p>
                                                <p>Model: {carData.model}</p>
                                                <p>Merk: {carData.brand}</p>
                                                {user.username === username && (
                                                    <button onClick={handleDeleteVehicle}>Verwijder</button>
                                                )}
                                            </div>
                                        )
                                    )}
                                </section>
                            )}

                        </main>
                    )}

                </div>

            </div>
        </div>
    );
}

export default Profile;

