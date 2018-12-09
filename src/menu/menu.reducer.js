import { actions } from '../utils/constants';

const INITIAL_STATE = {
  loadingGetRestaurant: false,
  restaurant: {
    categories: []
  },
  allProducts: [],
  openedCategories: []

}

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {

    case actions.CHANGE_RESTAURANT:
      return { ...state, restaurant: payload }


    case actions.CHANGE_PRODUCTS:
      return { ...state, allProducts: payload }

    case actions.CHANGE_OPENED_CATEGORIES:
      return { ...state, openedCategories: payload }

    case actions.CHANGE_LOADING_RESTAURANT:
      return { ...state, loadingGetRestaurant: payload }

    default:
      return state
  }
};