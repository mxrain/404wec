import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './categoriesSlice';
import resourcesReducer from './resourcesSlice';

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    resources: resourcesReducer,
    // 其他reducers...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;