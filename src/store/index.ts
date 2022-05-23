import { configureStore } from '@reduxjs/toolkit'
import {bugs} from '../features/bugs/bugs.slice'

export const store = configureStore({
  reducer: {
      bugs: bugs.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch