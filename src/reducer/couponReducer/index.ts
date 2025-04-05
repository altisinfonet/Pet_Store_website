import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface State {
    value: any
}

const initialState: State = {
    value: {},
}

export const getCouponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {
        setCoupon: (state, action: PayloadAction<any>) => {
            state.value = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { setCoupon } = getCouponSlice.actions

export default getCouponSlice.reducer