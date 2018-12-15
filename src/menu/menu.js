import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import LoadingGif from '../assets/imgs/loading.gif'


import CardItem from './cardItem/cardItem';
import HeaderTable from './headerTable/headerTable';
import {
  getRestaurant,
  dismemberCategory,
  changeOpenedCategories,
  changeExpandedCategory,
  changeExpandedMenuItem,
  changeExpandedChoose,
  endDragDrop
} from './menu.actions';
import { product_type } from '../utils/constants';
import FakeCard from './fakeCard/fakeCard'


import './menu.css';


class Menu extends Component {

  componentDidMount() {
    this.props.getRestaurant()
  }


  handleCategory({ category, isExpanded, isLoaded }) {
    const { changeOpenedCategories, dismemberCategory } = this.props;
    if (isExpanded) {
      changeOpenedCategories({ key: 'isExpanded', value: false, id: category.id });
    } else if (isLoaded) {
      changeOpenedCategories({ key: 'isExpanded', value: true, id: category.id });
    } else {
      dismemberCategory(category.id)
    }
  }

  getListStyle = (isDraggingOver) => ({
    boxShadow: isDraggingOver ? '1px 1px 5px #555' : '',
  });

  render() {
    const { menu, changeExpandedCategory, changeExpandedMenuItem, changeExpandedChoose, endDragDrop } = this.props;
    const { openedCategories, loadingGetRestaurant } = menu;

    return loadingGetRestaurant ?
      <div className="loadingContent">
        <img src={LoadingGif} alt="loading" />
      </div> :
      <div className="menu-container">
        <HeaderTable />
        <div className="table">
          <DragDropContext onDragEnd={(e) => endDragDrop(e, { type: product_type.CATEGORY })}>
            <Droppable droppableId="category">
              {(provided, snapshot) => (
                <ul className="categoryList"
                  ref={provided.innerRef}
                  style={this.getListStyle(
                    snapshot.isDraggingOver,
                  )}
                  key={'categoryList'}>
                  {openedCategories.map(({ category, menuItems, isExpanded, isLoading }, index) => (
                    <CardItem
                      index={index}
                      coord={`-${index}`}
                      isExpanded={isExpanded}
                      isLoading={isLoading}
                      onClick={() => this.handleCategory(openedCategories[index])}
                      subItems={menuItems}
                      type={product_type.CATEGORY}
                      description={`Cod: ${category.numericalId}`}
                      name={category.name}
                      onExpanded={() => changeExpandedCategory(category.id)}
                      image={category.image} />
                  )
                  )}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          <ul className="menuItensList" key={'menuItensList'} >
            {openedCategories.map(({ menuItems, isLoading }, indexCategory) => {
              const categoryIsExpanded = openedCategories[indexCategory].isExpanded;
              return categoryIsExpanded && menuItems.length > 0 ?
                <DragDropContext onDragEnd={(e) => endDragDrop(e, { type: product_type.MENU_ITEM, indexCategory })}>
                  <Droppable droppableId={product_type.MENU_ITEM}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} style={this.getListStyle(
                        snapshot.isDraggingOver,
                      )}>
                        {menuItems.map(({ id, name, image, products, isExpanded }, indexMenuItem) => (
                          <CardItem
                            index={indexMenuItem}
                            isDragging={snapshot.isDraggingOver}
                            onExpanded={() => changeExpandedMenuItem(indexCategory, indexMenuItem)}
                            coord={`${indexCategory}-${indexMenuItem}`}
                            categoryIsExpanded={categoryIsExpanded}
                            isExpanded={isExpanded}
                            isLoading={isLoading}
                            subItems={products}
                            type={product_type.MENU_ITEM}
                            name={name}
                            image={image} />
                        ))}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext> :
                <FakeCard key={`${1}-${indexCategory}`} isLoading={categoryIsExpanded && isLoading} expanded={categoryIsExpanded} />
            })}
          </ul>
          <ul className="chooseItemsList" key={'chooseItemsList'}>
            {openedCategories.map(({ menuItems, isLoading }, indexCategory) => {
              const categoryIsExpanded = openedCategories[indexCategory].isExpanded;
              return categoryIsExpanded && menuItems.length > 0 ?
                menuItems.map(({ name, products }, indexMenuItem) => {
                  const menuItemIsExpanded = menuItems[indexMenuItem].isExpanded;
                  return products.length > 0 && (menuItemIsExpanded || products.length === 1) ?
                    <DragDropContext onDragEnd={(e) => endDragDrop(e, { type: product_type.CHOOSABLE, indexCategory, indexMenuItem })}>
                      <Droppable droppableId={product_type.CHOOSABLE}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef}
                            style={this.getListStyle(
                              snapshot.isDraggingOver,
                            )}>
                            {products.map(({ name, image, products, maximumChoices, minimumChoices, isExpanded }, indexChoosable) => (
                              <CardItem
                                index={indexChoosable}
                                coord={`${indexCategory}-${indexMenuItem}-${indexChoosable}`}
                                isDragging={snapshot.isDraggingOver}
                                categoryIsExpanded={categoryIsExpanded}
                                isExpanded={isExpanded}
                                onExpanded={() => changeExpandedChoose(indexCategory, indexMenuItem, indexChoosable)}
                                isLoading={isLoading}
                                subItems={products}
                                type={product_type.CHOOSABLE}
                                name={name}
                                image={image}
                                description={`min: ${minimumChoices} - max: ${maximumChoices}`}
                              />
                            ))}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext> :
                    <FakeCard index={`${name}-${indexMenuItem}`} isLoading={categoryIsExpanded && isLoading} />
                }) :
                <FakeCard index={`${2}-${indexCategory}`} isLoading={categoryIsExpanded && isLoading} />
            })}
          </ul>
          <ul className="simpleItemsList" >
            {openedCategories.map(({ menuItems, isLoading }, indexCategory) => {
              const categoryIsExpanded = openedCategories[indexCategory].isExpanded;
              return categoryIsExpanded && menuItems.length > 0 ?
                menuItems.map(({ products }, indexMenuItem) => {
                  const menuItemIsExpanded = menuItems[indexMenuItem].isExpanded;
                  return products.length > 0 && (menuItemIsExpanded || products.length === 1) ?
                    products.map(({ products, isExpanded }, indexChoosable) => {
                      return isExpanded && products.length === 1 ?
                        <DragDropContext
                          onDragEnd={(e) => endDragDrop(e, { type: product_type.SIMPLE, indexCategory, indexMenuItem, indexChoosable })}>
                          <Droppable droppableId={product_type.SIMPLE}>
                            {(provided, snapshot) => (
                              <div ref={provided.innerRef} style={this.getListStyle(
                                snapshot.isDraggingOver,
                              )}>
                                {products.map(({ name, image, products, fullDescription }, index) => (
                                  <CardItem
                                    categoryIsExpanded={categoryIsExpanded}
                                    index={index}
                                    isDragging={snapshot.isDraggingOver}
                                    coord={`${indexCategory}-${indexMenuItem}-${indexChoosable}-${index}`}
                                    isLoading={isLoading}
                                    subItems={products}
                                    type={product_type.SIMPLE}
                                    name={name}
                                    image={image}
                                    description={fullDescription}
                                  />
                                ))}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext> :
                        <FakeCard index={indexChoosable} isLoading={categoryIsExpanded && isLoading} />
                    })
                    :
                    <FakeCard index={indexMenuItem} isLoading={categoryIsExpanded && isLoading} />
                }) :
                <FakeCard index={indexCategory} isLoading={categoryIsExpanded && isLoading} />
            })}
          </ul>
        </div >
      </div >
  }
}

const mapStateToProps = ({ menu }) => ({ menu })

export default connect(mapStateToProps, {
  getRestaurant,
  dismemberCategory,
  changeOpenedCategories,
  changeExpandedCategory,
  changeExpandedMenuItem,
  changeExpandedChoose,
  endDragDrop
})(Menu);