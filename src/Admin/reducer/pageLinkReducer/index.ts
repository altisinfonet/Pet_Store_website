import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface State {
    value: any
}

const initialState: State = {
    value: { key: "", subKey: "" },
}

export const getpageLinkSlice = createSlice({
    name: 'pageLink',
    initialState,
    reducers: {
        setPageLink: (state, action: PayloadAction<any>) => {
            state.value = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { setPageLink } = getpageLinkSlice.actions

export default getpageLinkSlice.reducer