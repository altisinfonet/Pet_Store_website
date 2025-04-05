import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
    value: any
}

const initialState: CounterState = {
    value: {},
}
export const meSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setMe: (state, action: PayloadAction<any>) => {
            console.log(action.payload, "action.payload______me")
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setMe } = meSlice.actions

export default meSlice.reducer