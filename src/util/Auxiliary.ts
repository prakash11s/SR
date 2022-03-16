import React from "react";

interface IAuxiliary {
  children:React.ReactNode
}

const Auxiliary = (props:IAuxiliary) => props.children;
export default Auxiliary;
