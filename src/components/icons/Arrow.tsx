import styled from "styled-components";
import { FC } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

interface IArrowIcon {
  isOpen: boolean;
}
const ArrowIcon = styled<FC<IArrowIcon>>(ExpandMoreIcon)`
  transition: 200ms;
  transform: rotateX(${(p) => (p.isOpen ? "180deg" : "0")});
`;

export default ArrowIcon;
