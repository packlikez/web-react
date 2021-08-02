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
type SubTask = Omit<Task, "subTasks">;

type CreateTask = Pick<Task, "title">;

interface TaskListState {
  loading: boolean;
  tasks: Task[];
}

const initialState: TaskListState = {
  loading: false,
  tasks: [],
};

export const fetchTasks = createAsyncThunk(name + "/fetchTasks", async () => {
  const url = "/tasks";
  const res = await http.get(url);
  return res.data;
});

export const createTask = createAsyncThunk(
  name + "/createTask",
  async (payload: CreateTask) => {
    const url = "/tasks";
    const res = await http.post(url, payload);
    return res.data;
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
    return { taskId, data: res.data.data };
  }
);

interface CreateSubTaskPayload {
  taskId: number;
  data: SubTask;
}
export const createSubTask = createAsyncThunk(
  name + "/createSubTask",
  async (payload: CreateSubTaskPayload) => {
    const { taskId, data } = payload;
    const url = `/tasks/${taskId}/subTasks`;
    const res = await http.post(url, data);
    return { taskId, data: res.data };
  }
);

interface UpdateSubTaskPayload {
  taskId: number;
  subTaskId: number;
  data: SubTask;
}
export const updateSubTask = createAsyncThunk(
  name + "/updateSubTask",
  async (payload: UpdateSubTaskPayload) => {
    const { taskId, subTaskId, data } = payload;
    const url = `/tasks/${taskId}/subTasks/${subTaskId}`;
    const res = await http.patch(url, data);
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
      .addCase(createTask.rejected, (state) => {
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
      .addCase(updateTask.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const { taskId, data } = action.payload;
        const taskIndex = state.tasks.findIndex((task) => task.id === taskId);
        state.tasks[taskIndex] = {
          ...data,
          subTasks: state.tasks[taskIndex].subTasks,
        };
      });

    builder
      .addCase(createSubTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSubTask.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createSubTask.fulfilled, (state, action) => {
        state.loading = false;
        const { taskId, data } = action.payload.data;
        const taskIndex = state.tasks.findIndex((task) => task.id === taskId);
        state.tasks[taskIndex].subTasks?.push(data);
      });

    builder
      .addCase(updateSubTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSubTask.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateSubTask.fulfilled, (state, action) => {
        state.loading = false;
        const { taskId, subTaskId, data } = action.payload.data;
        const task = state.tasks;
        const taskIndex = task.findIndex((task) => task.id === taskId);
        const subTasks = task[taskIndex].subTasks;
        if (subTasks) {
          const subTaskIndex = subTasks.findIndex(
            (subTask) => subTask.id === subTaskId
          );
          subTasks[subTaskIndex] = data;
        }
      });
  },
});

export const selectTask = (state: RootState) => state.task;

export default taskListSlice.reducer;
