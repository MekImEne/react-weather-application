import React from 'react';
import DailyAverage from '../DailyAverage';

/**
 * <function for showing the average of the temperature/humidity for the five other days in the week>
 * @param props to get parent (App) data
*/

function Fiveday(props) {
    return (
        <div>
            {props.items.map((item, index) => (
                <DailyAverage key={index} item={item} />
            ))}
        </div>
    )
}

export default Fiveday;