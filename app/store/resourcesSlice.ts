import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData } from '@/lib/api';
import { ResourcesState } from '../sys/add/types';

export const fetchResourcesAsync = createAsyncThunk(
  'resources/fetchResources',
  async () => {
    const data = await fetchData();
    return data.resources;
  }
);

interface ResourcesSliceState {
  resources: ResourcesState;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ResourcesSliceState = {
  resources: {},
  status: 'idle',
  error: null,
};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResourcesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchResourcesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.resources = action.payload;
      })
      .addCase(fetchResourcesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default resourcesSlice.reducer;