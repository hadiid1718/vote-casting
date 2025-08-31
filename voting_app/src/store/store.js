import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./ui-slice";
import voterSlice from "./vote-slice";

const store = configureStore({
  reducer: { ui: uiSlice.reducer, vote: voterSlice.reducer },
});
export default store;
