import React from 'react';

const IconSvg = ({ name, width, height, color }) => (
    <div>
        {
            name === 'actions' && (
                <svg viewBox="0 0 512 512" style={{ width, height, fill: color }}>
                    <circle cx="256" cy="256" r="64"></circle>
                    <circle cx="256" cy="448" r="64"></circle>
                    <circle cx="256" cy="64" r="64"></circle>
                </svg>
            )
        }
    </div>
)


export default IconSvg