import React from "react";
import {useParams} from "react-router-dom";

const ridesDatabase = [
    'sneller rit',
    'langzame rit',
    'supersonische rit',
];
    // dit alles kan dus ook met objecten!
function RidesOverview(){
    return (
        <div className="rides-overview-page">
            <h1>Alle gevonden ritten</h1>
            <ul>
                {ridesDatabase.map((rideName)=>{
                    return <li key={rideName}>{rideName}</li> //ridename moet in mijn geval iets van ID zijn! iets unieks!

                    // return <li key={rideId}><span><a href=".."></a> </span>{ride}</li>  : key op buitenste element!
                })}
            </ul>
        </div>
    );
}
export  default RidesOverview;