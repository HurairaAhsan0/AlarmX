import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  res: [],
};

export const AlarmSlice = createSlice({
  name: 'Alarm',
  initialState,
  reducers: {
    AddValue(state, action) {
      state.res.push(action.payload);
    },
    RemoveValue(state, action) {
      const sta = state.res.filter(function (v) {
        return v.value.id !== action.payload;
      });
      return {...state, res: sta};
    },
  },
});
export const {AddValue, RemoveValue} = AlarmSlice.actions;

export default AlarmSlice.reducer;
