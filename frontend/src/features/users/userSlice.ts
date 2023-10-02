import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  name: string;
  email: string;
  type: string;
  designation: string;
  organization: string;
  phone: string;
};

const initialState: InitialState = {
  name: "",
  email: "",
  type: "",
  designation: "",
  organization: "",
  phone: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    createUser: {
      prepare: (
        name: string,
        email: string,
        type: string,
        designation: string,
        organization: string,
        phone: string
      ): { payload: InitialState } => {
        return {
          payload: {
            name,
            email,
            type,
            designation,
            organization,
            phone,
          },
        };
      },
      reducer: (state, action: PayloadAction<InitialState>) => {
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.type = action.payload.type;
        state.organization = action.payload.organization;
        state.designation = action.payload.designation;
        state.phone = action.payload.phone;
      },
    },
  },
});

export const { createUser } = userSlice.actions;

export default userSlice.reducer;
