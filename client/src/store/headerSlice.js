import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
};

const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    toggleTheme: state => {
        state.theme = state.theme==='light' ? 'dark' : 'light'
      }
   
  },
});

export const {toggleTheme} = headerSlice.actions;

export default headerSlice.reducer;