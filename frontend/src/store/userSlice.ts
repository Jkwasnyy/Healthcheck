import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Gender = "male" | "female";

interface UserState {
  gender: Gender;
  weight: number;
  height: number;
}

const initialState: UserState = {
  gender: "female",
  weight: 30,
  height: 100,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setGender(state, action: PayloadAction<Gender>) {
      state.gender = action.payload;
    },
    setBody(state, action: PayloadAction<{ weight: number; height: number }>) {
      state.weight = action.payload.weight;
      state.height = action.payload.height;
    },
  },
});

export const { setGender, setBody } = userSlice.actions;
export default userSlice.reducer;
