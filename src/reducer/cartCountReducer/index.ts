import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface State {
    value: any
}

const initialState: State = {
    value: "",
}

export const getCartCountSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {
        setCartCount: (state, action: PayloadAction<any>) => {
            state.value = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { setCartCount } = getCartCountSlice.actions

export default getCartCountSlice.reducer