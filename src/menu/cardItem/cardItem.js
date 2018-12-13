import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import Placeholder from '../../assets/imgs/placeholder.png';
import IconSvg from '../../utils/iconSvg';
import { product_type } from '../../utils/constants';

import './cardItem.css'

const getItemStyle = (isDragging, draggableStyle, items) => ({
    // styles we need to apply on draggables
    ...draggableStyle,
    ...getHeight(items)
})

const getHeight = (items) => {
    let levels = [0, 0, 0]
    for (let x = 0; x < items.length; x++) {
        if (items[x].products && items[x].products.length > 0 &&
            typeof items[x].products[0] !== 'string') {
            for (let y = 0; y < items[x].products.length; y++) {
                if ((items[x].products[y].products
                    && items[x].products[y].products.length > 0) &&
                    typeof items[x].products[y].products[0] !== 'string') {

                    levels[2] += items[x].products[y].products.length

                }
                levels[1]++
            }
        }
        levels[0]++
    }
    const bigger = levels.sort((a, b) => a > b ? -1 : a < b ? 1 : 0);
    return ({ height: (bigger[0] ? bigger[0] : 1) * 82 })
}

class CardItem extends Component {
    render() {
        const { index, isOpen, isLoading, onClick, subItems, name, image, type, description } = this.props;
        return (
            <Draggable key={index} draggableId={`${type}-${index}`} index={index}>
                {(provided, snapshot) => (
                    <li className="column"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={(isOpen && !isLoading) ?
                            getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                                subItems
                            ) : {
                                ...snapshot.isDragging,
                                ...provided.draggableProps.style,
                            }
                        }>
                        {(isOpen && !isLoading && type === product_type.CATEGORY) && < div className="line right"></div>}

                        {subItems.length > 0 && product_type.CATEGORY !== type && <div className="line right"></div>}
                        {product_type.CATEGORY !== type && <div className="line"></div>}
                        {product_type.CATEGORY !== type && <div className="line-right"></div>}


                        <div className="card-item-content"
                            style={(isOpen && type === product_type.CATEGORY) ? { boxShadow: '-3px 3px 5px #ccc' } : {}}
                            onClick={onClick}>

                            <div className="actions">
                                <IconSvg name="actions" width={15} height={15} color="#ccc" />
                            </div>
                            <img src={(image && image.length > 0) ? image[0].url : Placeholder} alt="item" />
                            <div className={`card-item-info ${type}`}>
                                <p className="name">{name}</p>
                                {description && <p className="description">{description}</p>}
                            </div>
                        </div>
                    </li>
                )
                }
            </Draggable>
        );
    }
}


CardItem.propTypes = {
    type: PropTypes.string,
    image: PropTypes.array,
    name: PropTypes.string,
    description: PropTypes.string,
    descriptionInTooltip: PropTypes.bool
};


export default CardItem;