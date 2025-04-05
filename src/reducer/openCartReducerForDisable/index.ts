import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface State {
    value: boolean
}

const initialState: State = {
    value: false,
}

export const openCartDisableSlice = createSlice({
    name: 'openCartDisable',
    initialState,
    reducers: {
        setOpenCartDisable: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setOpenCartDisable } = openCartDisableSlice.actions

export default openCartDisableSlice.reducer