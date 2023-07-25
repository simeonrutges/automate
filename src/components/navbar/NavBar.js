import React, {useContext, useEffect} from 'react';
import logo from '../../assets/log met doorz achter 1000.png'
import {useHistory, Link, useLocation} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';
import './navbar.css';

function NavBar() {
    const {isAuth, logout} = useContext(AuthContext);
    const history = useHistory();
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isProfilePage = location.pathname === '/profile';
    const isMessagesPage = location.pathname === '/my-messages';

    const navButton = (path, label) => (
        <button type="button" onClick={() => history.push(path)}>
            {label}
        </button>
    );

    return (
        <div className="outer-content-container">
            <div className="inner-content-container">
                <nav className="nav">
                    <Link to="/">
                    <span className="logo-container">
                        <img src={logo} alt="logo"/>
                        <h3 className="brand">AutoMate</h3>
                    </span>
                    </Link>

                    <div className="nav-buttons">
                        {!isHomePage && navButton('/', 'Homepagina')}
                        {isHomePage && (
                            <>
                                {isAuth ? (
                                    navButton('/?section=how-it-works', 'Hoe werkt het?')
                                ) : (
                                    <>
                                        {navButton('/signin', 'Inloggen')}
                                        {navButton('/signup', 'Aanmelden')}
                                        {navButton('/?section=how-it-works', 'Hoe werkt het?')}
                                    </>
                                )}
                            </>
                        )}
                        {isAuth ? (
                            <>
                                {isProfilePage ? (
                                    <>
                                        {navButton('/my-rides', 'Mijn ritten')}
                                        {navButton('/my-messages', 'Mijn berichten')}
                                    </>
                                ) : isMessagesPage ? (
                                    <>
                                        {navButton('/my-rides', 'Mijn ritten')}
                                        {navButton('/profile', 'Profielpagina')}
                                    </>
                                ) : (
                                    navButton('/profile', 'Profielpagina')
                                )}
                                <button type="button" onClick={logout}>
                                    Log uit
                                </button>
                            </>
                        ) : (
                            !isHomePage && (
                                <>
                                    {navButton('/signin', 'Inloggen')}
                                    {navButton('/signup', 'Aanmelden')}
                                </>
                            )
                        )}
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default NavBar;