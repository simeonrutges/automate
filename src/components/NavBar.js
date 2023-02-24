import React, { useContext } from 'react';
// bovenstaande altijd nodig
import logo from '../assets/banana-01.png';
import { useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function NavBar() {
    const { isAuth, logout } = useContext(AuthContext);
    const history = useHistory();

    return (
        <nav>
            <Link to="/">
          <span className="logo-container">
            <img src={logo} alt="logo"/>
            <h3>
              AutoMate
            </h3>
          </span>
            </Link>
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
        </nav>
    );
}

export default NavBar;
// bovenstaande altijd nodig