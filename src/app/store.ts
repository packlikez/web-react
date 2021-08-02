import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import taskReducer from "../features/task/taskListSlice";
import reduxLogger from "redux-logger";

export const store = configureStore({
  reducer: {
    task: taskReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(reduxLogger),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
