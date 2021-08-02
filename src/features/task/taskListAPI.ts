import { createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../utils/http";
import { Task } from "./taskListSlice";

type CreateTask = Pick<Task, "title">;

export const fetchTasks = createAsyncThunk(
  name + "/fetchTasks",
  async (state, thunkAPI) => {
    const url = "/tasks";
    const res = await http.get(url);
    if (res.error) return thunkAPI.rejectWithValue(res.error);
    return res;
  }
);

export const createTask = createAsyncThunk(
  name + "/createTask",
  async (payload: CreateTask, thunkAPI) => {
    const url = "/tasks";
    const res = await http.post(url, payload);
    if (res.error) return thunkAPI.rejectWithValue(res.error);
    return { data: res.data };
  }
);

interface UpdateTaskPayload {
  taskId: number;
  done: boolean;
}
export const updateTask = createAsyncThunk(
  name + "/updateTask",
  async (payload: UpdateTaskPayload) => {
    const { taskId, done } = payload;
    const url = `/tasks/${taskId}`;
    const res = await http.patch(url, { done });
    return { taskId, data: res.data };
  }
);

interface CreateSubTaskPayload {
  taskId: number;
  title: string;
}
export const createSubTask = createAsyncThunk(
  name + "/createSubTask",
  async (payload: CreateSubTaskPayload) => {
    const { taskId, title } = payload;
    const url = `/tasks/${taskId}/subTasks`;
    const res = await http.post(url, { title });
    return { taskId, data: res.data };
  }
);

interface UpdateSubTaskPayload {
  taskId: number;
  subTaskId: number;
  done: boolean;
}
export const updateSubTask = createAsyncThunk(
  name + "/updateSubTask",
  async (payload: UpdateSubTaskPayload) => {
    const { taskId, subTaskId, done } = payload;
    const url = `/tasks/${taskId}/subTasks/${subTaskId}`;
    const res = await http.patch(url, { done });
    return { taskId, subTaskId, data: res.data };
  }
);
