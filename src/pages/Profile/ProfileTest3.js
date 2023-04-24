import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {useHistory} from "react-router-dom";
import axios from "axios";
import './profile.css';

import FileUploadForm from './FileUploadForm';


function Profile() {
    const [profileData, setProfileData] = useState({});
    const {user} = useContext(AuthContext);
    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);

    const [fetchProfileDataError, setFetchProfileDataError] = useState('');

    const [bio, setBio] = useState("");

    const [licensePlate, setLicensePlate] = useState('');
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [carData, setCarData] = useState({});

    const [toggle, setToggle] = useState(false);


    const history = useHistory();
    const token = localStorage.getItem("token");
    const username = user.username;

    const [uploadedImage, setUploadedImage] = useState(null);


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

            // Store the response data (result.data) in carData state
            setCarData(result.data);
            console.log(result.data)

            // Clear the input fields after successful submission
            // setLicensePlate('');
            // setModel('');
            // setBrand('');

        } catch (error) {
            console.error('Error submitting the vehicle data:', error);
        }
    }



    //// het probleem zit hier: morgen verder: als een bio wordt ingevuklt verdwijnt de auto

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

    ///
    // Haal de profielfoto op bij het laden van de component.

    // useEffect(() => {
    //     async function fetchProfileImage() {
    //         // console.log(user);
    //         console.log("filename: " + username.fileName);
    //         try {
    //             const response = await axios.get(`http://localhost:8080/users/downloadFromDB/${user.fileName}`, {
    //                 responseType: 'blob',
    //             });
    //             console.log(response.data);
    //             const image = URL.createObjectURL(response.data);
    //             console.log('Image URL:', image);
    //             setUploadedImage(image);
    //         } catch (error) {
    //             console.error('Error fetching profile image:', error);
    //         }
    //     }
    //
    //     if (user) {
    //         fetchProfileImage();
    //     }
    // }, [user]);

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

    ///








    return (
            <div className="outer-content-container">
                <div className="inner-content-container">
                    <div>


                        <h1>Mijn Profiel</h1>
                        <section className="profile-picture">
                            <section className="foto-name">


                                {/*{profileData.fileName && <img src={profileData.fileName.url} alt={profileData.username}/>}*/}


                                {uploadedImage ? (
                                    <>
                                        <img src={uploadedImage} alt="Profielfoto" />
                                        <button onClick={handleDelete}>Verwijder</button>
                                    </>
                                ) : (
                                    //
                                <FileUploadForm username={username} setToggle={setToggle} toggle={toggle}/>

                                )}


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


                            {Object.keys(carData).length === 0 ? (
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
                                    <h3>Mijn auto:</h3>
                                    <p>Kenteken: {carData.licensePlate}</p>
                                    <p>Model: {carData.model}</p>
                                    <p>Merk: {carData.brand}</p>
                                    <button onClick={handleDeleteVehicle}>Verwijder</button>
                                </div>
                            )}


                        </section>


                    </div>
                </div>
            </div>
        );
    }

export default Profile;



