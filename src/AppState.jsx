import { useState } from "react";

function AppState() {
  const [count, setCount] = useState(1);
  const [active, setActive] = useState(false);

  function handleDecrease() {
    setCount(count - 1);
  }

  function handleIncrease() {
    setCount(count + 1);
  }

  function handleChangeStatus() {
    active == true ? setActive(false) : setActive(true);
  }

  return (
    <>
      <button onClick={handleDecrease}> - </button>
      {count}
      <button onClick={handleIncrease}> + </button>
      <hr />
      <div>
        <h1>Hello</h1>
        <p>{String(active)}</p>
      </div>
      <button onClick={handleChangeStatus}>Update Status</button>
    </>
  );
}

export default AppState;
