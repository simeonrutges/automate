import React from "react";
import {useParams} from "react-router-dom";

function RidePage(){
    const {id} = useParams();
    //useParams geeft alleen welke sok het is

// GET request om sok 34 (id) op te vragen naar BE


    return(
        <ride className="outer-content-container">
            <div className="inner-content-container">

        <div className="product-page">
            <h1>Rit {id}</h1>
            <h2>$34,-</h2>
        </div>

            </div>
        </ride>


    )
}
export  default RidePage;