import React from 'react';

const IconSvg = ({ name, width, height, color }) => (
    <div style={{ display: 'flex' }}>
        {
            name === 'actions' && (
                <svg viewBox="0 0 512 512" style={{ width, height, fill: color }}>
                    <circle cx="256" cy="256" r="64"></circle>
                    <circle cx="256" cy="448" r="64"></circle>
                    <circle cx="256" cy="64" r="64"></circle>
                </svg>
            )
        }
        {name === 'add' &&
            <svg viewBox="0 0 52 52" style={{ width, height, fill: color }}>
                <path d="M26,0C11.664,0,0,11.663,0,26s11.664,26,26,26s26-11.663,26-26S40.336,0,26,0z M26,50C12.767,50,2,39.233,2,26   S12.767,2,26,2s24,10.767,24,24S39.233,50,26,50z"></path>
                <path d="M38.5,25H27V14c0-0.553-0.448-1-1-1s-1,0.447-1,1v11H13.5c-0.552,0-1,0.447-1,1s0.448,1,1,1H25v12c0,0.553,0.448,1,1,1   s1-0.447,1-1V27h11.5c0.552,0,1-0.447,1-1S39.052,25,38.5,25z"></path>
            </svg>
        }
        {
            name === 'minimize' &&
            < svg viewBox="0 0 129 129" style={{ width, height, fill: color }} >
                <path d="m64.5,122.4c31.9,0 57.9-26 57.9-57.9s-26-57.9-57.9-57.9-57.9,26-57.9,57.9 26,57.9 57.9,57.9zm0-107.7c27.4-3.55271e-15 49.8,22.3 49.8,49.8s-22.3,49.8-49.8,49.8-49.8-22.4-49.8-49.8 22.4-49.8 49.8-49.8z"></path>
                <path d="M37.8,68h53.3c2.3,0,4.1-1.8,4.1-4.1s-1.8-4.1-4.1-4.1H37.8c-2.3,0-4.1,1.8-4.1,4.1S35.6,68,37.8,68z"></path>
            </svg>
        }
    </div >
)


export default IconSvg