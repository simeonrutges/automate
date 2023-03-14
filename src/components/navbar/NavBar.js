import React, { useContext } from 'react';
// bovenstaande altijd nodig
// import logo from '../../assets/banana-01.png';
// import logo from '../../assets/log met doorz achter.png'
import logo from '../../assets/log met doorz achter 1000.png'
import { useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './navbar.css';

function NavBar() {
    //aanroepen context:
    const { isAuth, logout } = useContext(AuthContext);
    const history = useHistory();

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
                    <span className="nav-buttons">
            <button
                type="button"
                onClick={() => history.push('/signup')}
            >
                Hoe werkt het?
            </button>

            {isAuth ?
                <div>
                    <button
                        type="button"
                        onClick={() => history.push('/profile')}
                    >
                        Profielpagina
                    </button>
                <button
                    type="button"
                    onClick={logout}
                >
                    Log uit
                </button>
                </div>
                :
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
            }
            </span>


        </nav>
            </div>
        </navbar>
    );
}

export default NavBar;
// bovenstaande altijd nodig