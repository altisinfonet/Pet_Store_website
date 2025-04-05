import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
    value: any
}

const initialState: CounterState = {
    value: {},
}

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<any>) => {
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setSearch } = searchSlice.actions

export default searchSlice.reducer