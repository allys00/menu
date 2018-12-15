import React, { Fragment } from 'react';
import Skeleton from "react-loading-skeleton";

const FakeCard = ({ key, isLoading, expanded }) => (
    <Fragment>
        <li key={key}>
            <div style={style(!isLoading && expanded)}>
                {isLoading &&
                    <div className="column">
                        <Skeleton count={3} width={200} />
                    </div>
                }
                {!isLoading && expanded &&
                    <div className="noItems">
                        Sem Itens
                    </div>

                }
            </div>
        </li >
    </Fragment>
);
const style = (noItems) => ({
    width: 232,
    height: 82,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: noItems ? '#eee' : ''
})
export default FakeCard;