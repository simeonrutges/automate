import React, {useState} from 'react';
import axios from 'axios';
import './fileUploadForm.css';
import standard_profile_img from '../../assets/sustainability.jpg';

function FileUploadForm({username, setToggle, toggle}) {
    const token = localStorage.getItem('token');

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    function handleImageChange(e) {
        setFile(e.target.files[0]);
        setPreviewUrl(URL.createObjectURL(e.target.files[0]))

    }

    function isValidFileType(file) {
        const acceptedFileTypes = ['image/jpeg', 'image/jpg'];
        return file && acceptedFileTypes.includes(file.type);
    }

    async function sendImage(e) {
        e.preventDefault();

        if (!file) {
            alert('Selecteer een bestand om te uploaden.');
            return;
        }

        if (!isValidFileType(file)) {
            alert('Alleen .jpg en .jpeg bestanden zijn toegestaan.');

            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', username);

        try {
            const response = await axios.post('http://localhost:8080/users/single/uploadDb', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            setToggle(!toggle);

        } catch (error) {
            alert('Er is een fout opgetreden tijdens het uploaden: ' + error);
        }
    }

    return (
        <form onSubmit={sendImage} className="file-upload-container">
            <label>
                <img
                    src={previewUrl || standard_profile_img}
                    alt="Voorbeeld van de afbeelding die zojuist gekozen is"
                    className="image-preview"
                />
            </label>
            <div className="file-upload-actions">
                <input type="file" onChange={handleImageChange}/>
                {file && <button type="submit" className="preview-button">Upload preview</button>}
            </div>
        </form>
    );
}

export default FileUploadForm;

