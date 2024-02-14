import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  grid: [],
};

const gridSlice = createSlice({
  name: 'grid',
  initialState,
  reducers: {
    newGrid(state, action) {
      state.grid = [...state.grid, ...action.payload];
    },
    removeGrid(state, action) {
      const id = action.payload;
      state.grid = state.grid.filter(item => item.uniqueId !== id);
    },
    addGrid(state, action) {
      state.grid.unshift(action.payload);
    },
    editGrid(state, action) {
      state.grid = state.grid.map(item => 
        item.uniqueId === action.payload.uniqueId ? { ...item, ...action.payload } : item
      );
    }
  },
});

export const { newGrid,removeGrid,addGrid,editGrid } = gridSlice.actions;
export default gridSlice.reducer;