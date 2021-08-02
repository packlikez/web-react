import React, { FormEvent, SyntheticEvent, FC } from "react";
import {
  Collapse,
  List,
  ListItemIcon,
  Checkbox,
  ListItemText,
  TextField,
  ListItemSecondaryAction,
  Button,
  ListItem,
} from "@material-ui/core";
import { Task, SubTask } from "../taskListSlice";
import { createSubTask, updateSubTask } from "../taskListAPI";
import { useAppDispatch } from "../../../app/hooks";
import styled from "styled-components";
import useForm from "../../../app/useForm";

interface Form {
  subTask: { [k in number]: string };
}

interface SubTaskBoxProp {
  isOpen: boolean;
  task: Task;
  subTasks: SubTask[];
}

const SubTaskBox: FC<SubTaskBoxProp> = (props) => {
  const { isOpen, task, subTasks } = props;
  const dispatch = useAppDispatch();
  const form = useForm<Form>({
    subTask: {},
  });
  const handleCreateSubTask = (task: Task) => (e: FormEvent) => {
    e.preventDefault();
    dispatch(
      createSubTask({ taskId: task.id, title: form.values.subTask[task.id] })
    );
  };

  const handleToggleSubTask = (subTask: SubTask) => (e: SyntheticEvent) => {
    e.stopPropagation();
    dispatch(
      updateSubTask({
        taskId: subTask.parentId,
        subTaskId: subTask.id,
        done: !subTask.done,
      })
    );
  };

  return (
    <Collapse in={isOpen} timeout="auto" unmountOnExit>
      <List
        component="form"
        onSubmit={handleCreateSubTask(task)}
        disablePadding
      >
        {subTasks?.map((subTask, subTaskIndex) => {
          const subTaskKey = subTask.title + subTaskIndex;
          const subTaskLabel = subTask.title;
          const subTaskChecked = subTask.done;
          return (
            <SubList button key={subTaskKey}>
              <ListItemIcon onClick={handleToggleSubTask(subTask)}>
                <Checkbox checked={subTaskChecked} />
              </ListItemIcon>
              <ListItemText primary={subTaskLabel} />
            </SubList>
          );
        })}
        <SubList button>
          <TextField
            label="sub task"
            fullWidth
            value={form.values.subTask[task.id]}
            onChange={(e) => {
              const value = { ...form.values.subTask };
              value[task.id] = e.target.value;
              return form.onChange("subTask")(value);
            }}
          />
          <ListItemSecondaryAction>
            <Button color="primary" type="submit">
              Create
            </Button>
          </ListItemSecondaryAction>
        </SubList>
      </List>
    </Collapse>
  );
};

const SubList = styled(ListItem)`
  padding-left: 32px !important;
`;

export default SubTaskBox;
