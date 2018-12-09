import { all, takeEvery, call, put, select } from 'redux-saga/effects';
import { actions, urls } from '../utils/constants';
import { Get } from '../utils/api';

function* getRestaurant() {
  try {
    yield put({ type: actions.CHANGE_LOADING_RESTAURANT, payload: true });
    const restaurantResponse = yield call(Get, urls.restaurant);
    yield put({ type: actions.CHANGE_RESTAURANT, payload: restaurantResponse.data });
    let openedCategories = [];
    for (let category of restaurantResponse.data.categories) {
      openedCategories.push({
        category: category,
        menuItems: [],
        isLoading: false,
        isOpen: false,
        isLoaded: false,
      })
    }
    yield put({ type: actions.CHANGE_OPENED_CATEGORIES, payload: openedCategories });
    const productsResponse = yield call(Get, urls.products);
    yield put({ type: actions.CHANGE_PRODUCTS, payload: productsResponse.data.data });
  } catch (error) {
    console.error(error)
  } finally {
    yield put({ type: actions.CHANGE_LOADING_RESTAURANT, payload: false });
  }
}

function* changeOpenedCategory({ payload }) {
  const { id, key, value } = payload;
  const { openedCategories } = yield select(({ menu }) => menu);
  let newOpenedCategories = [...openedCategories];
  const index = openedCategories.findIndex(({ category }) => category.id === id);
  newOpenedCategories[index][key] = value;
  yield put({ type: actions.CHANGE_OPENED_CATEGORIES, payload: newOpenedCategories });
}


function* dismemberCategory({ payload }) {
  try {
    yield call(changeOpenedCategory, { payload: { key: 'isOpen', id: payload, value: true } })
    yield call(changeOpenedCategory, { payload: { key: 'isLoading', id: payload, value: true } })
    const { allProducts } = yield select(({ menu }) => menu);
    let menuItems = allProducts.filter(product => product.category === payload);
    console.log(menuItems)
    for (let menuItem of menuItems) {
      if (menuItem && menuItem.products.length > 0) {
        const response = yield all(menuItem.products.map(choosable_id => call(Get, choosable_id)));
        menuItem.products = response.map(res => res.data)
        for (let chooseItem of menuItem.products) {
          const response = yield all(chooseItem.products.map(simple_id => call(Get, simple_id)));
          chooseItem.products = response.map(res => res.data)
        }
      }
    }
    yield call(changeOpenedCategory, { payload: { key: 'menuItems', id: payload, value: menuItems } })
    yield call(changeOpenedCategory, { payload: { key: 'isLoaded', id: payload, value: true } })

  } catch (error) {
    console.error(error)
  } finally {
    yield call(changeOpenedCategory, { payload: { key: 'isLoading', id: payload, value: false } })
  }
}


export default function* StatisticsSaga() {
  yield all([
    yield takeEvery(actions.ASYNC_GET_RESTAURANT, getRestaurant),
    yield takeEvery(actions.ASYNC_DISMEMBER_CATEGORY, dismemberCategory),
    yield takeEvery(actions.ASYNC_CHANGE_OPENED_CATEGORIES, changeOpenedCategory),

  ]);
}