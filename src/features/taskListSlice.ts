import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import http from "../utils/http";

interface Task {
  id?: number;
  label: string;
  done: boolean;
  subTasks: SubTask[];
}
type SubTask = Omit<Task, "subTasks">;

interface TaskListState {
  loading: boolean;
  tasks: Task[];
}

const initialState: TaskListState = {
  loading: false,
  tasks: [],
};

const taskListSlice = createSlice({
  name: "taskList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      });

    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      });

    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state) => {
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
      .addCase(createSubTask.fulfilled, (state) => {
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
      .addCase(updateSubTask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateSubTask.fulfilled, (state, action) => {
        state.loading = false;
        const { taskId, subTaskId, data } = action.payload;
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

export const fetchTasks = createAsyncThunk(
  taskListSlice.name + "/fetchTasks",
  async () => {
    const url = "/task";
    const res = await http.get(url);
    return res.data;
  }
);

export const createTask = createAsyncThunk(
  taskListSlice.name + "/createTask",
  async (payload: Task) => {
    const url = "/task";
    const res = await http.post(url, payload);
    return res.data;
  }
);

interface UpdateTaskPayload {
  taskId: number;
  done: boolean;
}
export const updateTask = createAsyncThunk(
  taskListSlice.name + "/updateTask",
  async (payload: UpdateTaskPayload) => {
    const { taskId, done } = payload;
    const url = `/task/${taskId}`;
    const res = await http.patch(url, { done });
    return { taskId, data: res.data };
  }
);

interface CreateSubTaskPayload {
  taskId: number;
  data: SubTask;
}
export const createSubTask = createAsyncThunk(
  taskListSlice.name + "/createSubTask",
  async (payload: CreateSubTaskPayload) => {
    const { taskId, data } = payload;
    const url = `/task/${taskId}/subTasks`;
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
  taskListSlice.name + "/updateSubTask",
  async (payload: UpdateSubTaskPayload) => {
    const { taskId, subTaskId, data } = payload;
    const url = `/task/${taskId}/subTasks/${subTaskId}`;
    const res = await http.patch(url, data);
    return { taskId, subTaskId, data: res.data };
  }
);

export default taskListSlice.reducer;
