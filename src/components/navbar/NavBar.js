import React, {useContext, useEffect} from 'react';
import logo from '../../assets/log met doorz achter 1000.png'
import {useHistory, Link, useLocation} from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './navbar.css';

function NavBar() {
    const { isAuth, logout } = useContext(AuthContext);
    const history = useHistory();

    // test
    const location = useLocation();
    const isProfilePage = location.pathname === '/profile';
// einde

    return (
        <navbar className="outer-content-container">
            <div className="inner-content-container">
                <nav className="nav">

            <Link to="/">
          <span className="logo-container">
            <img src={logo} alt="logo"/>
            <h3>
              AutoMate
            </h3>
          </span>
            </Link>

{/*                    <span className="nav-buttons">*/}
{/*            <button*/}
{/*                type="button"*/}
{/*                onClick={() => history.push('/?section=how-it-works')}*/}
{/*            >*/}
{/*                Hoe werkt het?*/}
{/*            </button>*/}

{/*            {isAuth ?*/}
{/*                <div>*/}
{/*                    <button*/}
{/*                        type="button"*/}
{/*                        onClick={() => history.push('/profile')}*/}
{/*                    >*/}
{/*                        Profielpagina*/}
{/*                    </button>*/}
{/*                <button*/}
{/*                    type="button"*/}
{/*                    onClick={logout}*/}
{/*                >*/}
{/*                    Log uit*/}
{/*                </button>*/}
{/*                </div>*/}
{/*                :*/}
{/*                <div>*/}
{/*                    <button*/}
{/*                        type="button"*/}
{/*                        onClick={() => history.push('/signin')}*/}
{/*                    >*/}
{/*                        Inloggen*/}
{/*                    </button>*/}
{/*                    <button*/}
{/*                        type="button"*/}
{/*                        onClick={() => history.push('/signup')}*/}
{/*                    >*/}
{/*                        Aanmelden*/}
{/*                    </button>*/}
{/*                </div>*/}
{/*            }*/}
{/*            </span>*/}


{/*        </nav>*/}
{/*            </div>*/}
{/*        </navbar>*/}
{/*    );*/}
{/*}*/}

{/*export default NavBar;*/}

                    <span className="nav-buttons">
            {!isProfilePage && (
                <button
                    type="button"
                    onClick={() => history.push('/?section=how-it-works')}
                >
                    Hoe werkt het?
                </button>
            )}

                        {isAuth ? (
                            <div>
                                {isProfilePage ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => history.push('/my-rides')}
                                        >
                                            Mijn ritten
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => history.push('/my-messages')}
                                        >
                                            Mijn berichten
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => history.push('/profile')}
                                    >
                                        Profielpagina
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={logout}
                                >
                                    Log uit
                                </button>
                            </div>
                        ) : (
                            !isProfilePage && (
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => history.push('/signin')}
                                    >
                                        Inloggen
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => history.push('/signup')}
                                    >
                                        Aanmelden
                                    </button>
                                </div>
                            )
                        )}
            </span>
                </nav>
            </div>
        </navbar>
    );
}

export default NavBar;