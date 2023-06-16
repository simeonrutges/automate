import React from 'react';

function FormInput(props) {
    const { id, labelText, inputType, value, onChange, required, placeholder } = props;
    return (
        <div>
            <label htmlFor={id}>{labelText}</label>
            <input type={inputType} id={id} value={value} onChange={onChange} required={required} placeholder={placeholder}/>
        </div>
    );
}

export default FormInput;
