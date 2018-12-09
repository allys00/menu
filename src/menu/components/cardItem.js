import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Placeholder from '../../assets/imgs/placeholder.png';
import './cardItem.css'

class CardItem extends Component {
    render() {
        const { image, name, type, description } = this.props
        return (
            <div className="card-item-content">
                <img src={image ? image : Placeholder} alt="item" />
                <div className={`card-item-info ${type}`}>
                    <p className="name">{name}</p>
                    <p className="description">{description}</p>
                </div>
            </div>
        );
    }
}

CardItem.propTypes = {
    type: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string
};

export default CardItem;