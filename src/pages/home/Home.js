import React from 'react';
import { Link } from 'react-router-dom';
import Modal from "./../../context/modal/Modal";
import  './home.css';
import picture from '../../assets/shutterstock_2122349819.jpg'


function Home() {
    return (
        <home className="outer-content-container">
            <div className="inner-content-container">

                {/*Waarom heeft de margin 50px? -> App.css */}
                <section className="home">
                        <img src={picture} alt="beschrijving van de afbeelding" />
                        <div className="textvlak">
                            <h1>De slimmer keuze voor milieubewuste reizigers</h1>
                        </div>
                        <div className="blok">
                            <h1>hier komt het blok</h1>
                        </div>
                </section>

                <section>
                   <p>Als je ingelogd bent, bekijk dan de <Link to="/profile">Profielpagina</Link></p>
                <p>Je kunt ook <Link to="/signin">inloggen</Link> of jezelf <Link to="/signup">registeren</Link> als je nog geen
                    account hebt.</p>
                </section>

            </div>
        </home>
    );
}

export default Home;