import React, { FC } from "react";
import styled from "styled-components";

import TaskList from "./features/TaskList";

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
  align-items: center;

  height: 100vh;
  background-color: cadetblue;
`;

export default App;
