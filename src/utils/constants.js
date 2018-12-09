export const actions = {
    ASYNC_GET_RESTAURANT: "ASYNC_GET_RESTAURANT",
    CHANGE_LOADING_RESTAURANT: "CHANGE_LOADING_RESTAURANT",
    CHANGE_RESTAURANT: "CHANGE_RESTAURANT",
    CHANGE_PRODUCTS: "CHANGE_PRODUCTS",
    ASYNC_DISMEMBER_CATEGORY: "ASYNC_DISMEMBER_CATEGORY",
    CHANGE_OPENED_CATEGORIES: "CHANGE_OPENED_CATEGORIES",
    ASYNC_CHANGE_OPENED_CATEGORIES: "ASYNC_CHANGE_OPENED_CATEGORIES"
}

export const urls = {
    restaurant: 'https://api.staging.onyo.com/v1/mobile/company/1',
    products: 'https://api.staging.onyo.com/v1/mobile/company/1/products',

}
export const product_type = {
    CHOOSABLE: 'choosable',
    SIMPLE: 'simple',
    MENU_ITEM: 'menu-item',
};