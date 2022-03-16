import React from 'react';

import { IPhoneNumberListProps } from './Interface/IndexInterface';

/**
 * This is a temporary component, will be modified later
 */

const PhoneNumberList = (props: IPhoneNumberListProps):JSX.Element => {    
    const callPhone = (phoneNumber: string) => {
        props.dialNumber(phoneNumber);
    }

    //Phone number list
    return (
        <div>
            <div className="list-group">
                <h2>Click a number to dial</h2>
                <button onClick={() => callPhone('+31638360463')} type="button" className="list-group-item list-group-item-action">+31 63 8360463</button>
                <button onClick={() => callPhone('+‭31628742012')} type="button" className="list-group-item list-group-item-action">‭+31 62 8742012</button>
            </div>
        </div>
    )
}

export default PhoneNumberList; 