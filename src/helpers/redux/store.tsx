import { configureStore } from "@reduxjs/toolkit";
import friendsSlice from "./friendsSlice";
import itemSlice from "./itemSlice";
import mediasSlice from "./mediasSlice";
import totalItemsSlice from "./totalItemsSlice";
import userSlice from "./userSlice";

export const store = configureStore({
  reducer: {    
    itemReducer: itemSlice,
    totalItemsReducer: totalItemsSlice,
    friendsReducer: friendsSlice,
    mediasReducer: mediasSlice,
    userReducer: userSlice,
  },
});
