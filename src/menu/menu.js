import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import Skeleton from "react-loading-skeleton";

import CardItem from './cardItem/cardItem';
import HeaderTable from './headerTable/headerTable';
import { getRestaurant, dismemberCategory, changeOpenedCategories } from './menu.actions';


import './menu.css';
import { product_type } from '../utils/constants';

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
          <table>
            <tbody>
              {openedCategories.map(({ category, menuItems, isOpen, isLoading }, index) => (
                <tr key={index} >
                  <td className="column">
                    {(isOpen && !isLoading) && <div className="line right"></div>}
                    <CardItem
                      key={index}
                      name={category.name}
                      onClick={() => this.handleCategory(openedCategories[index])}
                      style={isOpen ? { boxShadow: '-3px 3px 5px #ccc' } : {}}
                      description={`Cod: ${category.numericalId}`}
                      image={category.image ? category.image[0].url : undefined} type="category" />
                  </td>
                  {isOpen && (isLoading ? (
                    <td className="row loading">
                      <div className="column">
                        <Skeleton count={3} width={200} />
                      </div>
                      <div className="column">
                        <Skeleton count={3} width={200} />
                      </div>
                      <div className="column">
                        <Skeleton count={3} width={200} />
                      </div>
                    </td>
                  ) :

                    (<td colSpan="3" style={{ width: "75%" }} >
                      {menuItems.map(({ name, image, fullDescription, products }, indexMenuItems) => (
                        <div className="menuItems" key={indexMenuItems} >
                          <div className="column items">
                            <div className="line"></div>
                            {products.length > 0 &&
                              <div className="line right"></div>
                            }
                            <span className="line-right" />
                            <div
                              data-for={name}
                              data-tip={`<p>${fullDescription ? fullDescription : 'Sem descrição'}</p>`}>
                              <CardItem
                                loading={true}
                                name={name}
                                image={image && image.length > 0 ? image[0].url : undefined} type={product_type.MENU_ITEM} />
                            </div>
                            <ReactTooltip
                              id={name}
                              place="bottom"
                              effect="solid"
                              html={true}
                              className="tooltip-card-item " />
                          </div>
                          <div className="column chooses">
                            {products.map(({ name, image, products, maximumChoices, minimumChoices }, indexChoose) => (
                              <div
                                key={indexChoose}
                                className="choose-container">
                                <div className="line"></div>

                                <span className="line-right" />
                                <div className="choose-item">
                                  <CardItem
                                    name={name}
                                    description={`min: ${minimumChoices} - max: ${maximumChoices}`}
                                    image={image && image.length > 0 ? image[0].url : undefined} type={product_type.CHOOSABLE} />
                                </div>
                                <div className="column simples">
                                  {products.map(({ name, image, fullDescription }, indexSimple) => (
                                    <div className="simple-item" key={indexSimple}>
                                      <div className="line"></div>
                                      <span className="line-right-simple" />
                                      <div data-for={name}
                                        data-tip={`<p>${fullDescription ? fullDescription : 'Sem descrição'}</p>`}>
                                        <CardItem
                                          name={name}
                                          descriptionInTooltip={true}
                                          image={image && image.length > 0 ? image[0].url : undefined} type={product_type.SIMPLE} />
                                      </div>
                                      <ReactTooltip
                                        id={name}
                                        place="bottom"
                                        effect="solid"
                                        html={true}
                                        className="tooltip-card-item " />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                    </td>))
                  }
                </tr>)
              )}
            </tbody>
          </table>
        </div>
      </div>
  }
}

const mapStateToProps = ({ menu }) => ({ menu })

export default connect(mapStateToProps, { getRestaurant, dismemberCategory, changeOpenedCategories })(Menu);