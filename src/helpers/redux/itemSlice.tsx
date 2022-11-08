import { createSlice } from "@reduxjs/toolkit";
import { initItem } from "../../services/constants";
import { ItemDataType } from "../../services/models";

const initialState = {
  item: initItem,
};

const itemSlice = createSlice({
  name: "itemReducer",
  initialState,
  reducers: {
    itemReducer(state, action) {
      const item: ItemDataType = action.payload.item;
      state.item = item;
    }
  },
});

export const { itemReducer } = itemSlice.actions;

export default itemSlice.reducer;