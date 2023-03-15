import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function Profile() {
    const [profileData, setProfileData] = useState({});
    const { user } = useContext(AuthContext);

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
    //             setProfileData(result.data);
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     }
    //
    //     fetchProfileData();
    // }, [])

    return (
        <profile className="outer-content-container">
            <div className="inner-content-container">

        <div>
            <h1>Mijn Profiel</h1>
            <div>
            <section>
                <h2>FOTO</h2>
                <h2>{user.username}</h2>
            </section>
            </div>


            {/*Als er keys in ons object zitten hebben we data, en dan renderen we de content*/}
            {Object.keys(profileData).length > 0 &&
                <section>
                    <h2>Strikt geheime profiel-content</h2>
                    <h3>{profileData.title}</h3>
                    <p>{profileData.content}</p>
                </section>
            }
            <p>Terug naar de <Link to="/">Homepagina</Link></p>
        </div>

            </div>
        </profile>
    );
}

export default Profile;