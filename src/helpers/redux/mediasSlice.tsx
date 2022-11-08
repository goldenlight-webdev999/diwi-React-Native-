import { createSlice } from "@reduxjs/toolkit";
import { initFriendsData } from "../../services/constants";
import { FriendType } from "../../services/models";

const initialState = {
  medias: initFriendsData,
};

const mediasSlice = createSlice({
  name: "mediasReducer",
  initialState,
  reducers: {
    mediasReducer(state, action) {
      const medias: FriendType[] = action.payload.medias;
      state.medias = medias;
    }
  },
});

export const { mediasReducer } = mediasSlice.actions;

export default mediasSlice.reducer;