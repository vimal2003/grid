import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  grid: [],
};

const gridSlice = createSlice({
  name: 'grid',
  initialState,
  reducers: {
    newGrid(state, action) {
      
      state.grid=[...state?.grid,...action?.payload];
    },
    removeGrid(state,action){
     const id=action.payload;
     const delIndex=state.grid.findIndex((i)=>i.uniqueId===id)
     state.grid.splice(delIndex,1);
    },
    addGrid(state,action){
      state.grid.unshift(action.payload)
    },
    editGrid(state,action){
      
      const data = [...state.grid]; 
         const index = data.findIndex((a) => a.uniqueId === action.payload.uniqueId); 
         if (index >= 0) {
           data[index] = { ...data[index], ...action.payload };
         }
         state.grid=data
    }
  },
});

export const { newGrid,removeGrid,addGrid,editGrid } = gridSlice.actions;
export default gridSlice.reducer;