import React from 'react';

function FormInput(props) {
    const { id, labelText, inputType, value, onChange } = props;
    return (
        <div>
            <label htmlFor={id}>{labelText}</label>
            <input type={inputType} id={id} value={value} onChange={onChange} />
        </div>
    );
}

export default FormInput;
