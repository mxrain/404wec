import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Resource } from '@/app/sys/add/types';
import { fetchResources } from '@/lib/api';



export interface ResourcesState {
  data: Record<string, Resource>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ResourcesState = {
  data: {},
  status: 'idle',
  error: null
};

export const fetchResourcesAsync = createAsyncThunk(
  'resources/fetchResources',
  async (_, { rejectWithValue }) => {
    try {
      const resources = await fetchResources();
      return resources;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

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
        state.data = Object.fromEntries(
          action.payload.map((resource: Resource) => [resource.id, resource])
        );
        state.error = null;
      })
      .addCase(fetchResourcesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default resourcesSlice.reducer;