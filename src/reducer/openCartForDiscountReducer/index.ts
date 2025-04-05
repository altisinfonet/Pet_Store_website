import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface State {
    value: boolean
}

const initialState: State = {
    value: false,
}

export const openCartDiscountSlice = createSlice({
    name: 'openCartDiscount',
    initialState,
    reducers: {
        setOpenCartDiscount: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setOpenCartDiscount } = openCartDiscountSlice.actions

export default openCartDiscountSlice.reducer