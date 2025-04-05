import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
    value: any
}

const initialState: CounterState = {
    value: "",
}

export const linkNameSlice = createSlice({
    name: 'linkName',
    initialState,
    reducers: {
        setLinkName: (state, action: PayloadAction<any>) => {
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setLinkName } = linkNameSlice.actions

export default linkNameSlice.reducer