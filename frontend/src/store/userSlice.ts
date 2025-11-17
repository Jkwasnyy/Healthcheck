import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Gender = "male" | "female";

interface UserState {
  gender: Gender;
  weight: number;
  height: number;
  ilness: string;
}

const initialState: UserState = {
  gender: "female",
  weight: 30,
  height: 100,
  ilness: "",
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
    setIlness(state, action: PayloadAction<string>) {
      state.ilness = action.payload;
    },
  },
});

export const { setGender, setBody, setIlness } = userSlice.actions;
export default userSlice.reducer;
