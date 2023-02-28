import React from "react";
import {useParams} from "react-router-dom";

function RidePage(){
    const {id} = useParams();
    //useParams geeft alleen welke sok het is

// GET request om sok 34 (id) op te vragen naar BE


    return(
        <div className="product-page">
            <h1>Rit {id}</h1>
            <h2>$34,-</h2>
        </div>


    )
}
export  default RidePage;