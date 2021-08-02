import React, { FC } from "react";
import styled from "styled-components";

import TaskList from "./features/task/TaskList";

const App: FC = () => {
  return (
    <Wrapper>
      <TaskList />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;

  margin: 48px 0;
`;

export default App;
