import { actions } from "../utils/constants";

export const getRestaurant = () => ({
    type: actions.ASYNC_GET_RESTAURANT
})

export const dismemberCategory = category_id => ({
    type: actions.ASYNC_DISMEMBER_CATEGORY,
    payload: category_id
})

export const changeOpenedCategories = coord => ({
    type: actions.ASYNC_CHANGE_OPENED_CATEGORIES,
    payload: coord
})

export const changeExpandedCategory = category_id => ({
    type: actions.CHANGE_EXPANDED_CATEGORY,
    payload: category_id
})

export const changeExpandedMenuItem = (index_category, index_menuItem) => ({
    type: actions.CHANGE_EXPANDED_MENU_ITEM,
    payload: { index_category, index_menuItem }
})

export const changeExpandedChoose = (index_category, index_menuItem, index_choose) => ({
    type: actions.CHANGE_EXPANDED_CHOOSE,
    payload: { index_category, index_menuItem, index_choose }
})

export const endDragDrop = (event, coord) => ({
    type: actions.MOVE_ITEM,
    payload: { event, coord }
})