import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import http from "../utils/http";
import { RootState } from "../app/store";

const name = "taskList";

export interface Task {
  id: number;
  title: string;
  done: boolean;
  subTasks: SubTask[];
}
export interface SubTask extends Omit<Task, "subTasks"> {
  parentId: number;
}

type CreateTask = Pick<Task, "title">;

interface TaskListState {
  loading: boolean;
  error: string;
  tasks: Task[];
}

const initialState: TaskListState = {
  loading: false,
  error: "",
  tasks: [],
};

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

const taskListSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data;
      });

    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.rejected, (state, action: any) => {
        const { message, data, statusCode } = action.payload;
        let error = message;
        if (statusCode === 400) {
          error = getErrorMsg(data);
        }
        state.error = error;
        state.loading = false;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload.data);
      });

    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.rejected, (state, action: any) => {
        const { message, data, statusCode } = action.payload;
        let error = message;
        if (statusCode === 400) {
          error = getErrorMsg(data);
        }
        state.error = error;
        state.loading = false;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const { taskId, data } = action.payload;
        const taskIndex = state.tasks.findIndex((task) => task.id === taskId);
        state.tasks[taskIndex] = data;
      });

    builder
      .addCase(createSubTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSubTask.rejected, (state, action: any) => {
        const { message, data, statusCode } = action.payload;
        let error = message;
        if (statusCode === 400) {
          error = getErrorMsg(data);
        }
        state.error = error;
        state.loading = false;
      })
      .addCase(createSubTask.fulfilled, (state, action) => {
        state.loading = false;
        const { taskId, data } = action.payload;
        const taskIndex = state.tasks.findIndex((task) => task.id === taskId);
        state.tasks[taskIndex].subTasks?.push(data);
      });

    builder
      .addCase(updateSubTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSubTask.rejected, (state, action: any) => {
        const { message, data, statusCode } = action.payload;
        let error = message;
        if (statusCode === 400) {
          error = getErrorMsg(data);
        }
        state.error = error;
        state.loading = false;
      })
      .addCase(updateSubTask.fulfilled, (state, action) => {
        state.loading = false;
        const { taskId, subTaskId, data } = action.payload;
        const tasks = state.tasks;
        const taskIndex = tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          if (!data.done) tasks[taskIndex].done = false;

          const subTasks = tasks[taskIndex].subTasks;
          const subTaskIndex = subTasks.findIndex(
            (subTask) => subTask.id === subTaskId
          );
          subTasks[subTaskIndex] = data;
        }
      });
  },
});

function getErrorMsg(obj: any) {
  return Object.keys(obj)
    .map((key) => obj[key])
    .join(", ");
}

export const selectTask = (state: RootState) => state.task;

export default taskListSlice.reducer;
