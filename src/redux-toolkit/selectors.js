import { createSelector } from "@reduxjs/toolkit"

export const productListSelector = (state) => state.productList.products
export const loadingSelector = (state) => state.productList.status
export const productListStateSelector = (state) => state.productList.status
export const recommendedSelector = (state) => state.filters.recommended
export const colorSelector = (state) => state.filters.color
export const priceSelector = (state) => state.filters.price
export const searchTextSelector = (state) => state.filters.searchText
export const categorySelector = (state) => state.filters.category
export const cartSelector = (state) => state.cart
export const orderListSelector = (state) => state.orders.orderList
export const orderLoadingSelector = (state) => state.orders.status
export const productSelector = (state) => state.productList.product
export const productPaginationSelector = (state) => state.manageProduct.data
export const loadingManageSelector = (state) => state.manageProduct.status

export const remainProducts = createSelector(
    productListSelector,
    searchTextSelector,
    colorSelector,
    categorySelector,
    recommendedSelector,
    priceSelector,
    (productList, searchText, color, category, recommended, price) => {
        let filtersProduct = [...productList]
        if (searchText) {
            filtersProduct = filtersProduct.filter((p) => p.title.toLowerCase().includes(searchText.toLowerCase()))
        }
        if (color !== 'All') {
            filtersProduct = filtersProduct.filter((p) => p.color.toLowerCase() === color.toLowerCase())
        }
        if (category !== 'All') {
            filtersProduct = filtersProduct.filter((p) => p.category.toLowerCase() === category.toLowerCase())
        }
        if (recommended !== 'All') {
            filtersProduct = filtersProduct.filter((p) => p.company.toLowerCase() === recommended.toLowerCase())
        }
        if (price !== '0,0') {
            const [min, max] = price.split(',')
            if (min !== max) {
                filtersProduct = filtersProduct.filter((p) => p.newPrice > Number(min) && p.newPrice <= Number(max))
            }
            else {
                filtersProduct = filtersProduct.filter((p) => p.newPrice > Number(min))
            }
        }
        return filtersProduct;
    }
)