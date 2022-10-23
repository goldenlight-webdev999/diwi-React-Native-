import { configureStore } from "@reduxjs/toolkit";
import itemSlice from "./itemSlice";

export const store = configureStore({
  reducer: {    
    itemReducer: itemSlice
  },
});
