import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
    value: any
}

const initialState: CounterState = {
    value: {},
}

export const thankyouSlice = createSlice({
    name: 'thankyou',
    initialState,
    reducers: {
        setThankyou: (state, action: PayloadAction<any>) => {
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setThankyou } = thankyouSlice.actions

export default thankyouSlice.reducer