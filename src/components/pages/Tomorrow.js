import React from 'react';
import Perhour from '../Perhour';
import '../../styles/Tomorrow.css';

/**
 * <function for showing details of the weather for Tomorrow hourly >
 * @param props to get parent (App) data
*/

function Tomorrow(props) {
    return (
        <div className="perhour-wrapper">
            {props.items.map((item, index) => (
            <Perhour key={index} item={item} />
            ))}
        </div>
    )
}

export default Tomorrow;