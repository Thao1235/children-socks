import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
    name: 'productList',
    initialState: {
        status: 'idle',
        products: [],
        product: {}
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductThunkAction.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchProductThunkAction.fulfilled, (state, action) => {
                state.status = 'idle'
                state.products = action.payload
            })
            .addCase(fetchProductByIdThunkAction.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchProductByIdThunkAction.fulfilled, (state, action) => {
                state.status = 'idle'
                state.product = action.payload
            })
    }
})

export const fetchProductThunkAction = createAsyncThunk('productList/fetchProductThunkAction', async () => {
    let productListRes = await fetch('https://data-casestudy.onrender.com/products')
    let data = await productListRes.json()
    data = data.sort(function (item_1, item_2) {
        return Number(item_2.id) - Number(item_1.id)
    })
    return data;
})

export const fetchProductByIdThunkAction = createAsyncThunk(
    'productList/fetchProductByIdThunkAction',
    async (productId) => {
        let productRes = await fetch(`https://data-casestudy.onrender.com/products/${productId}`)
        let product = await productRes.json()
        return product;
    }
)

export default productsSlice;