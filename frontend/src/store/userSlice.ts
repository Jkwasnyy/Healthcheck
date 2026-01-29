import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Gender = "male" | "female";

interface UserState {
  gender: Gender;
  weight: number;
  height: number;
  bmi: number;
}

const initialState: UserState = {
  gender: "female",
  weight: 30,
  height: 100,
  bmi: 0,
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
      state.bmi = state.weight / Math.pow(state.height / 100, 2);
    },
  },
});

export const { setGender, setBody } = userSlice.actions;
export default userSlice.reducer;
