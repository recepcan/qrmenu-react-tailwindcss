import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  mobilMenu: false,
};

const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    toggleTheme: state => {
        state.theme = state.theme==='light' ? 'dark' : 'light'
      },
    toggleMenu:state=>{
      state.mobilMenu=  !state.mobilMenu
    }  
   
  },
});

export const {toggleTheme ,toggleMenu } = headerSlice.actions;

export default headerSlice.reducer;