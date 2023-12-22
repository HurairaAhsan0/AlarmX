import {configureStore} from '@reduxjs/toolkit';
import AlarmSlice from './AlarmSlice';

export const store = configureStore({
  reducer: AlarmSlice,
});
export default store;
