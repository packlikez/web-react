import React, {
  useState,
  Fragment,
  FC,
  SyntheticEvent,
  useEffect,
} from "react";
import styled from "styled-components";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Checkbox,
  ListItemSecondaryAction,
  Paper,
  TextField,
  Button,
  LinearProgress,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  selectTask,
  fetchTasks,
  createTask,
  updateTask,
  Task,
} from "./taskListSlice";
import useForm from "../app/useForm";

const TaskList = () => {
  const task = useAppSelector(selectTask);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(-1);
  const form = useForm<{ task: string }>({ task: "" });

  const handleClick = (taskIndex: number) => () => {
    if (open === taskIndex) return setOpen(-1);
    setOpen(taskIndex);
  };

  const handleSubTaskCheck =
    (taskIndex: number, subTaskIndex: number) => (e: SyntheticEvent) => {
      e.stopPropagation();

      // setTodos((prevState) => {
      //   const prevSubTasks = prevState[taskIndex].subTasks;
      //   if (!prevSubTasks) return prevState;
      //
      //   prevSubTasks[subTaskIndex].done = !prevSubTasks[subTaskIndex].done;
      //
      //   return [...prevState];
      // });
    };

  const handleCreateTask = () => {
    dispatch(createTask({ title: form.values.task }));
  };

  const handleToggleTask = (task: Task) => (e: SyntheticEvent) => {
    e.stopPropagation();
    dispatch(updateTask({ taskId: task.id, done: !task.done }));

    // setTodos((prevState) => {
    //   prevState[taskIndex].done = !prevState[taskIndex].done;
    //   return [...prevState];
    // });
  };

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  return (
    <Wrapper>
      <ListBox elevation={3}>
        {task.loading && <LinearProgress />}
        <List
          subheader={
            <HeadBox>
              <HeadText>Todo</HeadText>
              <TextField
                label="new task name"
                value={form.values.task}
                onChange={(e) => form.onChange("task")(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateTask}
              >
                Create
              </Button>
            </HeadBox>
          }
        >
          {task.tasks.map((task, taskIndex) => {
            const taskKey = task.title + taskIndex;
            const label = task.title;
            const isOpen = taskIndex === open;
            const subTasks = task.subTasks;
            const checked = task.done;
            return (
              <Fragment key={taskKey}>
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
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {subTasks?.map((subTask, subTaskIndex) => {
                      const subTaskKey = subTask.title + subTaskIndex;
                      const subTaskLabel = subTask.title;
                      const subTaskChecked = subTask.done;
                      return (
                        <SubList button key={subTaskKey}>
                          <ListItemIcon
                            onClick={handleSubTaskCheck(
                              taskIndex,
                              subTaskIndex
                            )}
                          >
                            <Checkbox checked={subTaskChecked} />
                          </ListItemIcon>
                          <ListItemText primary={subTaskLabel} />
                        </SubList>
                      );
                    })}
                    <SubList button>
                      <TextField label="sub task" fullWidth />
                      <ListItemSecondaryAction>
                        <Button color="primary">Create</Button>
                      </ListItemSecondaryAction>
                    </SubList>
                  </List>
                </Collapse>
              </Fragment>
            );
          })}
        </List>
      </ListBox>
    </Wrapper>
  );
};

interface IArrowIcon {
  isOpen: boolean;
}
const ArrowIcon = styled<FC<IArrowIcon>>(ExpandMoreIcon)`
  transition: 200ms;
  transform: rotateX(${(p) => (p.isOpen ? "180deg" : "0")});
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  row-gap: 8px;
  width: 100%;
  max-width: 360px;
`;

const ListBox = styled(Paper)``;

const SubList = styled(ListItem)`
  padding-left: 32px !important;
`;

const HeadText = styled.h1`
  text-align: center;
`;

const HeadBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  row-gap: 8px;
  margin: 16px 0;
`;

export default TaskList;
