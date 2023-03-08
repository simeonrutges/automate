import React from 'react';

function SpreadOperatorVb() {
    const cheese = ['burrita', 'brie'];
    const ingredienst = ['pasta', ...cheese, 'sauce'];

    console.log(ingredienst)


    const partOne = {
        name: 'Piet',
        age: 45,
    }

    const partTwo = {
        city: 'Utrecht',
        email: 'piterepietsen@novi.nl',
    }

    const total1 = {
        ...partOne,
        ...partTwo,
    }
    console.log(total1);

    const total2 = {
        ...partOne,
        ...partTwo,
        city: 'Amsterdam',
        zip: '1016vm',
    }
    console.log(total2);


    return (

        <div>
            hin
        </div>
    );
}

export default SpreadOperatorVb;