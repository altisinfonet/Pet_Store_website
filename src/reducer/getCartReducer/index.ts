import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface State {
    value: any
}

const initialState: State = {
    value: [],
}

export const getCartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<any>) => {
            state.value = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { setCart } = getCartSlice.actions

export default getCartSlice.reducer