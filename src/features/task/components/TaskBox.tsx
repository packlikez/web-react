import React, { SyntheticEvent, FC } from "react";
import {
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import { Task } from "../taskListSlice";
import { updateTask } from "../taskListAPI";
import { useAppDispatch } from "../../../app/hooks";
import ArrowIcon from "../../../components/icons/Arrow";

interface TaskBoxProp {
  taskIndex: number;
  task: Task;
  open: number;
  setOpen: (val: number) => void;
}

const TaskBox: FC<TaskBoxProp> = (props) => {
  const { taskIndex, task, open, setOpen } = props;
  const dispatch = useAppDispatch();

  const handleClick = (taskIndex: number) => () => {
    if (open === taskIndex) return setOpen(-1);
    setOpen(taskIndex);
  };

  const handleToggleTask = (task: Task) => (e: SyntheticEvent) => {
    e.stopPropagation();
    dispatch(updateTask({ taskId: task.id, done: !task.done }));
  };

  const label = task.title;
  const isOpen = taskIndex === open;
  const subTasks = task.subTasks;
  const checked = task.done;

  return (
    <ListItem button onClick={handleClick(taskIndex)}>
      <ListItemIcon onClick={handleToggleTask(task)}>
        <Checkbox checked={checked} />
      </ListItemIcon>
      <ListItemText primary={label} />
      {subTasks && (
        <ListItemSecondaryAction>
          <ArrowIcon isOpen={isOpen} />
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default TaskBox;
