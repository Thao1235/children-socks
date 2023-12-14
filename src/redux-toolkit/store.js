import { configureStore } from "@reduxjs/toolkit";
import productsSlice from "../slices/productsSlice";
import filtersSlice from "../slices/filtersSlice";
import cartSlice from "../slices/cartSlice";
import orderSlice from "../slices/orderSlice";
import manageProductSlice from "../slices/manageProductSlice";

const store = configureStore({
    reducer: {
        productList: productsSlice.reducer,
        filters: filtersSlice.reducer,
        cart: cartSlice.reducer,
        orders: orderSlice.reducer,
        manageProduct: manageProductSlice.reducer
    }
})

export default store;