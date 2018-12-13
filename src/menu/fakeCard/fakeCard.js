import React from 'react';
import Skeleton from "react-loading-skeleton";

const FakeCard = ({ key, isLoading }) => (
    <li key={key}>
        <div style={style}>
            {isLoading &&
                <div className="column">
                    <Skeleton count={3} width={200} />
                </div>
            }
        </div>
    </li >
);
const style = {
    width: 232,
    height: 82,
    display: 'flex',
    alignItem: 'center'
}
export default FakeCard;