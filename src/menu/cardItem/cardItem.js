import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Placeholder from '../../assets/imgs/placeholder.png';
import IconSvg from '../../utils/iconSvg';

import './cardItem.css'

class CardItem extends Component {
    render() {
        const { image, name, type, description, style, onClick = () => { } } = this.props
        return (
            <div className="card-item-content" style={style} onClick={onClick}>
                <div className="actions">
                    <IconSvg name="actions" width={15} height={15} color="#ccc" />
                </div>
                <img src={image ? image : Placeholder} alt="item" />
                <div className={`card-item-info ${type}`}>
                    <p className="name">{name}</p>
                    {description && <p className="description">{description}</p>}
                </div>
            </div>
        );
    }
}

CardItem.propTypes = {
    type: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    descriptionInTooltip: PropTypes.bool
};

export default CardItem;