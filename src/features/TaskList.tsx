import React, { useState, Fragment, FC, SyntheticEvent } from "react";
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
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const todosMock = [
  {
    label: "Task1",
    done: false,
  },
  {
    label: "Task2",
    done: false,
  },
  {
    label: "Task3",
    done: false,
    subTasks: [{ label: "Sub Task 1", done: false }],
  },
  {
    label: "Task4",
    done: false,
  },
];

const MyComponent = () => {
  const [todos, setTodos] = useState(todosMock);
  const [open, setOpen] = useState(-1);

  const handleClick = (taskIndex: number) => () => {
    if (open === taskIndex) return setOpen(-1);
    setOpen(taskIndex);
  };

  const handleCheck = (taskIndex: number) => (e: SyntheticEvent) => {
    e.stopPropagation();

    setTodos((prevState) => {
      prevState[taskIndex].done = !prevState[taskIndex].done;
      return [...prevState];
    });
  };

  const handleSubTaskCheck =
    (taskIndex: number, subTaskIndex: number) => (e: SyntheticEvent) => {
      e.stopPropagation();

      setTodos((prevState) => {
        const prevSubTasks = prevState[taskIndex].subTasks;
        if (!prevSubTasks) return prevState;

        prevSubTasks[subTaskIndex].done = !prevSubTasks[subTaskIndex].done;

        return [...prevState];
      });
    };

  return (
    <Wrapper>
      <ListBox elevation={3}>
        <List subheader={<HeadText>Todo</HeadText>}>
          {todos.map((task, taskIndex) => {
            const taskKey = task.label + taskIndex;
            const label = task.label;
            const isOpen = taskIndex === open;
            const subTasks = task.subTasks;
            const checked = task.done;
            return (
              <Fragment key={taskKey}>
                <ListItem button onClick={handleClick(taskIndex)}>
                  <ListItemIcon onClick={handleCheck(taskIndex)}>
                    <Checkbox checked={checked} />
                  </ListItemIcon>
                  <ListItemText primary={label} />
                  {subTasks && (
                    <ListItemSecondaryAction>
                      <ArrowIcon isOpen={isOpen} />
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
                {subTasks?.map((subTask, subTaskIndex) => {
                  const subTaskKey = subTask.label + subTaskIndex;
                  const subTaskLabel = subTask.label;
                  const subTaskChecked = subTask.done;
                  return (
                    <Collapse
                      key={subTaskKey}
                      in={isOpen}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        <SubList button>
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
                      </List>
                    </Collapse>
                  );
                })}
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

export default MyComponent;
