import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
    value: any
}

const initialState: CounterState = {
    value: {},
}

export const listingTypeSlice = createSlice({
    name: 'listingType',
    initialState,
    reducers: {
        setListingType: (state, action: PayloadAction<any>) => {
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setListingType } = listingTypeSlice.actions

export default listingTypeSlice.reducer