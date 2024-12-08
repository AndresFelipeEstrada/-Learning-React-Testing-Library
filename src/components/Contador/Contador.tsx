import React, { useState } from "react";

export const Contador = () => {
  const [counter, setCounter] = useState(0);

  const handleCounter = () => setCounter((prev) => prev + 1);


  return (
    <>
      <div>Contador: {counter}</div>
      <button onClick={handleCounter}>Incrementar</button>
    </>
  );
};
