import { createSlice } from "@reduxjs/toolkit";
import { initFriendsData } from "../../services/constants";
import { FriendType } from "../../services/models";

const initialState = {
  friends: initFriendsData,
};

const friendsSlice = createSlice({
  name: "friendsReducer",
  initialState,
  reducers: {
    friendsReducer(state, action) {
      const friends: FriendType[] = action.payload.friends;
      state.friends = friends;
    }
  },
});

export const { friendsReducer } = friendsSlice.actions;

export default friendsSlice.reducer;