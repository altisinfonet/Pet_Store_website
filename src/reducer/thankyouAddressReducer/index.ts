import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
    value: any
}

const initialState: CounterState = {
    value: {},
}

export const thankyouAddressSlice = createSlice({
    name: 'thankyou',
    initialState,
    reducers: {
        setThankyouAddress: (state, action: PayloadAction<any>) => {
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setThankyouAddress } = thankyouAddressSlice.actions

export default thankyouAddressSlice.reducer