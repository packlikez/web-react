import React, { FormEvent, FC } from "react";
import { TextField, Button } from "@material-ui/core";
import styled from "styled-components";

import { createTask } from "../taskListAPI";
import useForm from "../../../app/useForm";
import { useAppDispatch } from "../../../app/hooks";

interface Form {
  task: string;
}

const TaskHeader: FC = () => {
  const dispatch = useAppDispatch();
  const form = useForm<Form>({
    task: "",
  });

  const handleCreateTask = (e: FormEvent) => {
    e.preventDefault();
    dispatch(createTask({ title: form.values.task }));
  };
  return (
    <HeadBox onSubmit={handleCreateTask}>
      <HeadText>Todo</HeadText>
      <TextField
        label="new task name"
        value={form.values.task}
        onChange={(e) => form.onChange("task")(e.target.value)}
      />
      <Button variant="contained" color="primary" type="submit">
        Create
      </Button>
    </HeadBox>
  );
};

const HeadText = styled.h1`
  text-align: center;
`;

const HeadBox = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  row-gap: 8px;
  margin: 16px 0;
`;

export default TaskHeader;
