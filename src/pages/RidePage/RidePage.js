import React, {useContext, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";

function RidePage(){
    const [rideData, setRideData] = useState({});
    const { user } = useContext(AuthContext);


    const {id} = useParams();
    //useParams geeft alleen welke sok het is

// GET request om sok 34 (id) op te vragen naar BE


    return(
        <ride className="outer-content-container">
            <div className="inner-content-container">

        <div className="product-page">
            {/*<h1>Rit {id}</h1>*/}
            {/*<h2>$34,-</h2>*/}

            {Object.keys(rideData).length > 0 &&
                <section>
                    <h2>Strikt geheime profiel-content</h2>
                    <h3>{rideData.destination}</h3>
                    {/*<p>{rideData.content}</p>*/}
                </section>
            }

        </div>


                <p>Terug naar de <Link to="/">Homepagina</Link></p>
            </div>
        </ride>


    )
}
export  default RidePage;