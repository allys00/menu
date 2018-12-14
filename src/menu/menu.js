import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';


import CardItem from './cardItem/cardItem';
import HeaderTable from './headerTable/headerTable';
import {
  getRestaurant,
  dismemberCategory,
  changeOpenedCategories,
  changeExpandedCategory,
  changeExpandedMenuItem,
  changeExpandedChoose
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



  render() {
    const { menu, changeExpandedCategory, changeExpandedMenuItem, changeExpandedChoose } = this.props;
    const { openedCategories, loadingGetRestaurant } = menu;
    openedCategories.sort((a, b) => a.category.order > b.category.order ? 1 : a.category.order < b.category.order ? -1 : 0)

    console.log('render')


    return loadingGetRestaurant ?
      <p>...Loading</p> :
      <div className="menu-container">
        <HeaderTable />
        <div className="table">
          <DragDropContext onDragEnd={console.log}>
            <Droppable droppableId="category">
              {(provided, snapshot) => (
                <ul className="categoryList" ref={provided.innerRef} key={'categoryList'}>
                  {openedCategories.map(({ category, menuItems, isExpanded, isLoading }, index) => (
                    <CardItem
                      index={index}
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
                <DragDropContext onDragEnd={console.log}>
                  <Droppable droppableId={product_type.MENU_ITEM}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef}>
                        {menuItems.map(({ id, name, image, products, isExpanded }, indexMenuItem) => (
                          <CardItem
                            index={indexMenuItem}
                            onExpanded={() => changeExpandedMenuItem(indexCategory, indexMenuItem)}
                            categoryIsExpanded={categoryIsExpanded}
                            isExpanded={isExpanded}
                            isLoading={isLoading}
                            onClick={console.log}
                            subItems={products}
                            type={product_type.MENU_ITEM}
                            name={name}
                            image={image} />
                        ))}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext> :
                <FakeCard key={`${1}-${indexCategory}`} isLoading={categoryIsExpanded && isLoading} />
            })}
          </ul>
          <ul className="chooseItemsList" key={'chooseItemsList'}>
            {openedCategories.map(({ menuItems, isExpanded, isLoading }, indexCategory) => {
              const categoryIsExpanded = openedCategories[indexCategory].isExpanded;
              return categoryIsExpanded && menuItems.length > 0 ?
                menuItems.map(({ name, products }, indexMenuItems) => {
                  const menuItemIsExpanded = menuItems[indexMenuItems].isExpanded;
                  return products.length > 0 && (menuItemIsExpanded || products.length === 1) ?
                    <DragDropContext onDragEnd={console.log}>
                      <Droppable droppableId={product_type.CHOOSABLE}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef}>
                            {products.map(({ name, image, products, maximumChoices, minimumChoices, isExpanded }, indexChoosable) => (
                              <CardItem
                                index={indexChoosable}
                                categoryIsExpanded={categoryIsExpanded}
                                isExpanded={isExpanded}
                                onExpanded={() => changeExpandedChoose(indexCategory, indexMenuItems, indexChoosable)}
                                isLoading={isLoading}
                                onClick={console.log}
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
                    <FakeCard index={`${name}-${indexMenuItems}`} isLoading={categoryIsExpanded && isLoading} />
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
                      return (isExpanded || products.length === 1) ?
                        <DragDropContext onDragEnd={console.log}>
                          <Droppable droppableId={product_type.SIMPLE}>
                            {(provided, snapshot) => (
                              <div ref={provided.innerRef}>
                                {products.map(({ name, image, products, fullDescription }, index) => (
                                  <CardItem
                                    categoryIsExpanded={categoryIsExpanded}
                                    index={index}
                                    isLoading={isLoading}
                                    onClick={console.log}
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
  changeExpandedChoose
})(Menu);