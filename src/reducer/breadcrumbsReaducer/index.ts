import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface State {
    value: any
}

const initialState: State = {
    value: [],
}

export const breadcrumbsSlice = createSlice({
    name: 'breadcrumbs',
    initialState,
    reducers: {
        setBreadcrumbs: (state, action: PayloadAction<any>) => {
            state.value = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { setBreadcrumbs } = breadcrumbsSlice.actions

export default breadcrumbsSlice.reducer