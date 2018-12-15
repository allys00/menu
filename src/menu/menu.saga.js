import { all, takeEvery, call, put, select } from 'redux-saga/effects';
import { actions, urls, product_type } from '../utils/constants';
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
        isExpanded: false,
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

function* changeExpandedCategory({ payload }) {
  try {
    let { openedCategories } = yield select(({ menu }) => menu)
    const index = openedCategories.findIndex(({ category }) => category.id === payload);
    if (index !== -1) {
      yield call(changeOpenedCategory, { payload: { key: 'isExpanded', id: payload, value: !openedCategories[index].isExpanded } })
    } else {
      console.error('Item não encontrado');
    }
  } catch (error) {
    console.error(error)
  }
}


function* changeExpandedMenuItem({ payload }) {
  try {
    const { index_category, index_menuItem } = payload
    let { openedCategories } = yield select(({ menu }) => menu)
    let category = { ...openedCategories[index_category] }
    let menuItem = category.menuItems[index_menuItem]
    menuItem.isExpanded = !menuItem.isExpanded
    return yield call(changeOpenedCategory, { payload: { key: 'menuItems', id: category.category.id, value: category.menuItems } })
  } catch (error) {
    console.error(error)
  }
}

function* changeExpandedChoose({ payload }) {
  try {
    const { index_category, index_menuItem, index_choose } = payload
    let { openedCategories } = yield select(({ menu }) => menu);
    let category = { ...openedCategories[index_category] }
    let choose = category.menuItems[index_menuItem].products[index_choose]
    choose.isExpanded = !choose.isExpanded
    return yield call(changeOpenedCategory, { payload: { key: 'menuItems', id: category.category.id, value: category.menuItems } })
  } catch (error) {
    console.error(error)
  }
}

function* moveItem({ payload }) {
  const { event, coord } = payload;
  const { destination, source } = event;
  const { type, indexCategory, indexMenuItem, indexChoosable } = coord;
  try {
    let { openedCategories } = yield select(({ menu }) => menu);
    if (type === product_type.CATEGORY) {
      const currentItem = openedCategories[source.index]
      openedCategories.splice(source.index, 1);
      if (destination) {
        openedCategories.splice(destination.index, 0, currentItem);
      }
    } else if (type === product_type.MENU_ITEM) {
      const currentItem = openedCategories[indexCategory].menuItems[source.index]
      openedCategories[indexCategory].menuItems.splice(source.index, 1);
      if (destination) {
        openedCategories[indexCategory].menuItems.splice(destination.index, 0, currentItem);
      }
    } else if (type === product_type.CHOOSABLE) {
      const currentItem = openedCategories[indexCategory].menuItems[indexMenuItem].products[source.index]
      openedCategories[indexCategory].menuItems[indexMenuItem].products.splice(source.index, 1);
      if (destination) {
        openedCategories[indexCategory].menuItems[indexMenuItem].products.splice(destination.index, 0, currentItem);
      }
    } else if (type === product_type.SIMPLE) {
      const currentItem = openedCategories[indexCategory].menuItems[indexMenuItem].products[indexChoosable].products[source.index]
      openedCategories[indexCategory].menuItems[indexMenuItem].products[indexChoosable].products.splice(source.index, 1);
      if (destination) {
        openedCategories[indexCategory].menuItems[indexMenuItem].products[indexChoosable].products.splice(destination.index, 0, currentItem);
      }
    }
    yield put({ type: actions.CHANGE_OPENED_CATEGORIES, payload: openedCategories });
  } catch (error) {
    console.error(error)
  }
}

function* dismemberCategory({ payload }) {
  try {
    yield call(changeOpenedCategory, { payload: { key: 'isExpanded', id: payload, value: true } })
    yield call(changeOpenedCategory, { payload: { key: 'isLoading', id: payload, value: true } })
    const { allProducts } = yield select(({ menu }) => menu);
    let menuItems = allProducts.filter(product => product.category === payload);
    for (let menuItem of menuItems) {
      menuItem.isExpanded = menuItem.products.length <= 1
      if (menuItem && menuItem.products.length > 0) {
        const response = yield all(menuItem.products.map(choosable_id => call(Get, choosable_id)));
        menuItem.products = response.map(res => res.data)
        for (let chooseItem of menuItem.products) {
          chooseItem.isExpanded = chooseItem.isExpanded = chooseItem.products.length <= 1
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
    yield takeEvery(actions.CHANGE_EXPANDED_CATEGORY, changeExpandedCategory),
    yield takeEvery(actions.CHANGE_EXPANDED_MENU_ITEM, changeExpandedMenuItem),
    yield takeEvery(actions.CHANGE_EXPANDED_CHOOSE, changeExpandedChoose),
    yield takeEvery(actions.MOVE_ITEM, moveItem)
  ]);
}