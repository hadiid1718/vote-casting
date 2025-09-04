import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./ui-slice";
import voterSlice from "./vote-slice";
import blogSlice from "./blog-slice";

const store = configureStore({
  reducer: { ui: uiSlice.reducer, vote: voterSlice.reducer, blog: blogSlice },
});
export default store;
