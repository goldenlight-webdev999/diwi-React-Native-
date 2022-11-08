import { createSlice } from "@reduxjs/toolkit";
import { initItemsData } from "../../services/constants";
import { ItemDataType } from "../../services/models";

const initialState = {
  items: initItemsData,
};

const totalItemsSlice = createSlice({
  name: "totalItemsReducer",
  initialState,
  reducers: {
    totalItemsReducer(state, action) {
      const items: ItemDataType[] = action.payload.items;
      state.items = items;
    }
  },
});

export const { totalItemsReducer } = totalItemsSlice.actions;

export default totalItemsSlice.reducer;