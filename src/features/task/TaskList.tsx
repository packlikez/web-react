import React, { useState, Fragment, FC, useEffect } from "react";
import styled from "styled-components";

import { List, Paper, LinearProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectTask } from "./taskListSlice";
import { fetchTasks } from "./taskListAPI";
import SubTaskBox from "./components/SubTaskBox";
import TaskBox from "./components/TaskBox";
import TaskHeader from "./components/TaskHeader";

const TaskList: FC = () => {
  const task = useAppSelector(selectTask);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(-1);

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  return (
    <Wrapper>
      <ListBox elevation={3}>
        {task.loading && <LinearProgress />}
        <Snackbar open={!!task.error} autoHideDuration={6000}>
          <Alert severity="error">{task.error}</Alert>
        </Snackbar>
        <List subheader={<TaskHeader />}>
          {task.tasks.map((task, taskIndex) => {
            const taskKey = task.title + taskIndex;
            const isOpen = taskIndex === open;
            const subTasks = task.subTasks;
            return (
              <Fragment key={taskKey}>
                <TaskBox
                  task={task}
                  taskIndex={taskIndex}
                  open={open}
                  setOpen={setOpen}
                />
                <SubTaskBox isOpen={isOpen} task={task} subTasks={subTasks} />
              </Fragment>
            );
          })}
        </List>
      </ListBox>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  overflow: auto;
  row-gap: 8px;
  width: 100%;
  max-width: 360px;
`;

const ListBox = styled(Paper)``;

export default TaskList;
