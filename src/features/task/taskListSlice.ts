import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import {
  fetchTasks,
  createTask,
  updateTask,
  createSubTask,
  updateSubTask,
} from "./taskListAPI";

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

function getErrorMsg(obj: any): string {
  return Object.keys(obj)
    .map((key) => obj[key])
    .join(", ");
}

export const selectTask = (state: RootState): TaskListState => state.task;

export default taskListSlice.reducer;
