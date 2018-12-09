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