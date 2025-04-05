import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface State {
    value: boolean
}

const initialState: State = {
    value: false,
}

export const openAuthSlice = createSlice({
    name: 'openAuth',
    initialState,
    reducers: {
        setOpenAuth: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setOpenAuth } = openAuthSlice.actions

export default openAuthSlice.reducer