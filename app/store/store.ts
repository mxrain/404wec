import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './features/categories/categoriesSlice';
import resourcesReducer from './features/resources/resourcesSlice';

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    resources: resourcesReducer,
    // 其他reducers...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;