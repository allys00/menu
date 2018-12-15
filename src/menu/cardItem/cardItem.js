import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import Placeholder from '../../assets/imgs/placeholder.png';
import Trash from '../../assets/imgs/trash.png';
import IconSvg from '../../utils/iconSvg';
import { product_type } from '../../utils/constants';

import './cardItem.css'

const getItemStyle = (draggableStyle, items) => ({
  // styles we need to apply on draggables
  ...draggableStyle,
  ...getHeight(items)
})

const getHeight = (items, type) => {
  let item = 0
  for (let x = 0; x < items.length; x++) {
    if (items[x].isExpanded && items[x].products && items[x].products.length > 0) {
      for (let y = 0; y < items[x].products.length; y++) {
        if (items[x].products[y].isExpanded && items[x].products[y].products && items[x].products[y].products.length > 0) {
          item += items[x].products[y].products.length
        } else {
          item++
        }
      }
    } else {
      item++
    }
  }
  return ({ height: (item ? item : 1) * 82 })
}

class CardItem extends Component {
  render() {
    const {
      index,
      coord,
      categoryIsExpanded,
      isExpanded,
      isLoading,
      onClick,
      subItems,
      name,
      image,
      type,
      description,
      onExpanded,
      isDragging
    } = this.props;

    return (
      <Draggable key={index} draggableId={coord} index={index}>
        {(provided, snapshot) => {
          const isDraggingMode = !isDragging && !snapshot.isDragging
          const isDraggingOut = snapshot.isDragging && !snapshot.draggingOver

          return (
            <li className="column"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={(isExpanded && !isLoading && (categoryIsExpanded || type === product_type.CATEGORY)) ?
                getItemStyle(
                  provided.draggableProps.style,
                  subItems
                ) : {
                  ...provided.draggableProps.style,
                }
              }>
              {isDraggingMode && (isExpanded && !isLoading && type === product_type.CATEGORY) && < div className="line right"></div>}
              {isDraggingMode && subItems.length > 0 && product_type.CATEGORY !== type && product_type.SIMPLE !== type && <div className="line right"></div>}
              {isDraggingMode && product_type.CATEGORY !== type && <div className="line"></div>}
              {isDraggingMode && product_type.CATEGORY !== type && <div className="line-vertical"></div>}
              {isDraggingMode && (product_type.CATEGORY !== type && subItems.length > 1) &&
                <div className="expanded" onClick={onExpanded}>
                  <IconSvg name={isExpanded ? 'minimize' : 'add'} width={20} height={20} color="#545454" />
                </div>}

              {isDraggingOut ?
                <div className="card-item-content isOver" >
                  <img src={Trash} alt="item" className="trash" />
                  <div className={`card-item-info ${type}`}>
                    <p className="name">Remover Item</p>
                  </div>
                </div>
                :
                <div className={`card-item-content ${isDraggingOut ? 'isOver' : ''}`}
                  style={(isExpanded && type === product_type.CATEGORY) ? { boxShadow: '-3px 3px 5px #ccc' } : {}}
                  onClick={onClick}>
                  <img src={!isDraggingOut ? (image && image.length > 0) ? image[0].url : Placeholder : Trash} alt="item" />
                  <div className={`card-item-info ${type}`}>
                    <p className="name">{isDraggingOut ? 'REMOVER ITEM' : name}</p>
                    {description && <p className="description">{description}</p>}
                  </div>
                </div>
              }
            </li>
          )
        }}
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