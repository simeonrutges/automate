import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";
import './profile.css';
import standard_profile_img from '../../assets/sustainability.jpg';
import FileUploadForm from './FileUploadForm';
import CustomButton from "../../components/Button/CustomButton";

function Profile() {
    const { username: viewedUsername } = useParams();
    console.log("viewedUsername = " + viewedUsername);
    const history = useHistory();


    const [profileData, setProfileData] = useState({});
    const {user} = useContext(AuthContext);
    const username = viewedUsername ? viewedUsername : user.username;
    // const history = useHistory();
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
                console.log(result);
                if (result.data && result.data.username) {
                    setProfileData(result.data);
                    console.log("profileData : " + profileData.fileName);
                } else {
                    console.error("Ongeldige response van de server");
                }
            } catch (e) {
                console.error(e);
                // alle error informatie die je nodig hebt staat hier:
                console.log(e.response);
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
                    },
                }
            );

            if (result.data && result.data.username) {
                setProfileData(result.data);
                console.log(result.data);
                console.log(carData);
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
        // const handleDeleteBio = async () => {
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
            setBio(""); // Reset bio state to clear the textarea
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
            console.log(result.data);

            setCarData(result.data);
            console.log(result.data)

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
            console.log("profileData filename: " + profileData.fileName);
            if (profileData.fileName) {
                try {
                    const response = await axios.get(`http://localhost:8080/users/downloadFromDB/${profileData.fileName}`, {
                        responseType: 'blob',
                    });
                    console.log(response.data);
                    const image = URL.createObjectURL(response.data);
                    console.log('Image URL:', image);
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

                    {user.username === username ?(
                    <h1>Mijn Profiel</h1>
                        ) : (
                            <h1>{username}'s  profiel</h1>
                        )}
                    <section className="profile-picture">
                        <section className="foto-name">

                            {uploadedImage ? (
                                <div className="file-upload-container">
                                    <img src={uploadedImage} alt="Profielfoto" className="image-upload"/>
                                    {user.username === username && (
                                        <button onClick={handleDelete}>Verwijder</button>
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
                                        <img src={standard_profile_img} alt="Standaard profielfoto" className="image-upload"/>
                                    )}
                                </div>
                            )}

                            <h4>{username}</h4>
                        </section>
                    </section>




                    {Object.keys(profileData).length > 0 && (
                        <section className="bio">
                            <h4>Contactgegevens</h4>
                            <p>Rol: {profileData.roles}</p>
                            <p>Voornaam: {profileData.firstname}</p>
                            <p>Achternaam: {profileData.lastname}</p>
                            <p>Telefoon:{profileData.phoneNumber}</p>
                            <p>Email: {profileData.email}</p>



                            {user.username !== username && (
                                <button onClick={handleSendMessage}>Stuur {profileData.firstname} een bericht</button>
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
                                    )}

                                </div>
                            )}
                        </section>
                    )}

                    {profileData.roles && profileData.roles.includes('BESTUURDER') && (

                        <section className="vehicle-submit">
                            {/*{user.username === username && (*/}
                            {Object.keys(carData).length === 0 && user.username === username? (
                                // {Object.keys(carData).length === 0 && user.username === username? (
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


                            ) : (
                                <div>
                                    {user.username === username ?(
                                    <h4>Mijn auto:</h4>
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
                            )}
                        </section>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Profile;