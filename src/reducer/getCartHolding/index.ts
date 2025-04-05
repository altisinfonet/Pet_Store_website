import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface State {
    value: any
}

const initialState: State = {
    value: [],
}

export const getCartHoldingSlice = createSlice({
    name: 'cartHolding',
    initialState,
    reducers: {
        setCartHolding: (state, action: PayloadAction<any>) => {
            state.value = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { setCartHolding } = getCartHoldingSlice.actions

export default getCartHoldingSlice.reducer