import { createSlice,createAsyncThunk  } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  adminMenu:false
};

// Kullanıcı bilgilerini asenkron olarak çekme
export const fetchUserByUsername = createAsyncThunk(
  "user/fetchUserByUsername",
  async (username, { rejectWithValue }) => {
    try {
      const response = await fetch(`/server/user/username/${username}`);
      if (!response.ok) {
        throw new Error("User not found");  // Eğer kullanıcı bulunamazsa hata fırlat
      }
      const data = await response.json();
      return data;  // Redux state'ine aktarılacak olan veriler
    } catch (error) {
      return rejectWithValue(error.message);  // Hata mesajını Redux'a ilet
    }
  }
);
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setadminMenu:(state)=>{
      state.adminMenu=!state.adminMenu
   },
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
  setadminMenu
} = userSlice.actions;

export default userSlice.reducer;