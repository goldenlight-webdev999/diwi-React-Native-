import { createSlice } from "@reduxjs/toolkit";
import { authUserType } from "../../services/models";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userReducer(state, action) {
      const user: any = action.payload.user;
      state.user = user;
    }
  },
});

export const { userReducer } = userSlice.actions;

export default userSlice.reducer;