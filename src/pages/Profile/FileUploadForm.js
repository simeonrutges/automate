// FileUploadForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './fileUploadForm.css';

// const FileUploadForm = ({ username }) => {
//     const [file, setFile] = useState(null);
//
//     const onFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };
//
//     const onFormSubmit = async (e) => {
//         e.preventDefault();
//
//         if (!file) {
//             alert('Selecteer een bestand om te uploaden.');
//             return;
//         }
//
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('username', username);
//
//         try {
//             const response = await axios.post('http://localhost:8080/users/single/uploadDb', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//
//             alert('Bestand geüpload: ' + response.data.fileName);
//         } catch (error) {
//             alert('Er is een fout opgetreden tijdens het uploaden: ' + error);
//         }
//     };
//
//     return (
//         <form onSubmit={onFormSubmit}>
//             <input type="file" onChange={onFileChange} />
//             <button type="submit">Upload</button>
//         </form>
//     );
// };
//
// export default FileUploadForm;

// function FileUploadForm({ username }) {
//     const [file, setFile] = useState(null);
//
//     function onFileChange(e) {
//         setFile(e.target.files[0]);
//     }
//
//     async function onFormSubmit(e) {
//         e.preventDefault();
//
//         if (!file) {
//             alert('Selecteer een bestand om te uploaden.');
//             return;
//         }
//
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('username', username);
//
//         try {
//             const response = await axios.post('http://localhost:8080/users/single/uploadDb', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//
//             alert('Bestand geüpload: ' + response.data.fileName);
//         } catch (error) {
//             alert('Er is een fout opgetreden tijdens het uploaden: ' + error);
//         }
//     }
//
//     return (
//         <form onSubmit={onFormSubmit}>
//             <input type="file" onChange={onFileChange} />
//             <button type="submit">Upload</button>
//         </form>
//     );
// }
//
// export default FileUploadForm;

function FileUploadForm({ username }) {
    const [file, setFile] = useState(null);

    function onFileChange(e) {
        setFile(e.target.files[0]);
    }

    function isValidFileType(file) {
        const acceptedFileTypes = ['image/jpeg', 'image/jpg'];
        return file && acceptedFileTypes.includes(file.type);
    }

    async function onFormSubmit(e) {
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
                },
            });

            alert('Bestand geüpload: ' + response.data.fileName);
        } catch (error) {
            alert('Er is een fout opgetreden tijdens het uploaden: ' + error);
        }
    }

    return (
        <form onSubmit={onFormSubmit}>
            <input type="file" onChange={onFileChange} />
            <button type="submit">Upload</button>
        </form>
    );
}

export default FileUploadForm;

