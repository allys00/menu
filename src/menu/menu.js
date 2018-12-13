import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';


import CardItem from './cardItem/cardItem';
import HeaderTable from './headerTable/headerTable';
import { getRestaurant, dismemberCategory, changeOpenedCategories } from './menu.actions';
import { product_type } from '../utils/constants';
import FakeCard from './fakeCard/fakeCard'


import './menu.css';


class Menu extends Component {

  componentDidMount() {
    this.props.getRestaurant()
  }

  handleCategory({ category, isOpen, isLoaded }) {
    const { changeOpenedCategories, dismemberCategory } = this.props;
    if (isOpen) {
      changeOpenedCategories({ key: 'isOpen', value: false, id: category.id });
    } else if (isLoaded) {
      changeOpenedCategories({ key: 'isOpen', value: true, id: category.id });
    } else {
      dismemberCategory(category.id)
    }
  }



  render() {
    const { menu } = this.props;
    const { openedCategories, loadingGetRestaurant } = menu;
    openedCategories.sort((a, b) => a.category.order > b.category.order ? 1 : a.category.order < b.category.order ? -1 : 0)
    return loadingGetRestaurant ?
      <p>...Loading</p> :
      <div className="menu-container">
        <HeaderTable />
        <div className="table">
          <DragDropContext onDragEnd={console.log}>
            <Droppable droppableId="category">
              {(provided, snapshot) => (
                <ul className="categoryList" ref={provided.innerRef} key={'categoryList'}>
                  {openedCategories.map(({ category, menuItems, isOpen, isLoading }, index) => (
                    <CardItem
                      index={index}
                      isOpen={isOpen}
                      isLoading={isLoading}
                      onClick={() => this.handleCategory(openedCategories[index])}
                      subItems={menuItems}
                      type={product_type.CATEGORY}
                      description={`Cod: ${category.numericalId}`}
                      name={category.name}
                      image={category.image} />
                  )
                  )}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          <ul className="menuItensList" key={'menuItensList'} >
            {openedCategories.map(({ category, menuItems, isOpen, isLoading }, indexCategory) => {
              return isOpen && menuItems.length > 0 ?
                <DragDropContext onDragEnd={console.log}>
                  <Droppable droppableId={product_type.MENU_ITEM}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef}>
                        {menuItems.map(({ name, image, products }, indexMenuItem) => (
                          <CardItem
                            index={indexMenuItem}
                            isOpen={isOpen}
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
                <FakeCard key={`${1}-${indexCategory}`} isLoading={isLoading} />
            })}
          </ul>
          <ul className="chooseItemsList" key={'chooseItemsList'}>
            {openedCategories.map(({ category, menuItems, isOpen, isLoading }, indexCategory) => {
              return isOpen && menuItems.length > 0 ?
                menuItems.map(({ name, products }, indexMenuItems) => {
                  return products.length > 0 ?
                    <DragDropContext onDragEnd={console.log}>
                      <Droppable droppableId={product_type.CHOOSABLE}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef}>
                            {products.map(({ name, image, products, maximumChoices, minimumChoices }, indexChoosable) => (
                              <CardItem
                                index={indexChoosable}
                                isOpen={isOpen}
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
                    <FakeCard index={`${name}-${indexMenuItems}`} isLoading={isLoading} />
                }) :
                <FakeCard index={`${2}-${indexCategory}`} isLoading={isLoading} />
            })}
          </ul>
          <ul className="simpleItemsList" >
            {openedCategories.map(({ menuItems, isOpen, isLoading }, index) => {
              return isOpen && menuItems.length > 0 ?
                menuItems.map(({ products }) => {
                  return products.length > 0 ?
                    products.map(({ products }) => (
                      <DragDropContext onDragEnd={console.log}>
                        <Droppable droppableId={product_type.SIMPLE}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef}>
                              {products.map(({ name, image, products, fullDescription }, index) => (
                                <CardItem
                                  index={index}
                                  isOpen={isOpen}
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
                      </DragDropContext>))
                    :
                    <FakeCard index={index} isLoading={isLoading} />
                }) :
                <FakeCard index={index} isLoading={isLoading} />
            })}
          </ul>
        </div >
      </div >
  }
}

const mapStateToProps = ({ menu }) => ({ menu })

export default connect(mapStateToProps, { getRestaurant, dismemberCategory, changeOpenedCategories })(Menu);