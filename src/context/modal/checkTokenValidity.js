import { useHistory } from 'react-router-dom';
import jwt_decode from "jwt-decode";

// De functie hier
function checkTokenValidity(token) {
    const decodedToken = jwt_decode(token);

    const currentDate = new Date();
    const expiryDate = new Date(decodedToken.exp * 1000);

    return expiryDate >= currentDate;
}

function App() {
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !checkTokenValidity(token)) {
            // Log de gebruiker uit of verwijder de token als deze is verlopen
            localStorage.removeItem('token');
            // Navigeer naar een inlogpagina of iets dergelijks
            history.push('/login');
        }
    }, []);  // De lege array betekent dat deze useEffect alleen wordt uitgevo

const token = localStorage.getItem('token');
if (token) {
    const isValid = checkTokenValidity(token);
    if (!isValid) {
        // Als de token niet geldig is (bijv. verlopen), log dan de gebruiker uit of vernieuw de token
    }
}
