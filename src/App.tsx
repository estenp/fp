import * as React from 'react';

const initialState = { count: 0 };

const reducer = (
    state: { count: number },
    action: { type: string; payload?: number }
  ) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'custom':
      return { count: action.payload || state.count };
    default:
      throw new Error();
  }
};

const Example = () => {
  // this function is used to manage state, where Array.reduce is used to perform transformations on elements of an array
  // even the reducer seems different!
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // const [currentAccumulator, callReducer] = React.useReducer((acc: number, val: number) => acc + val, 0);

  return (
    <>
      <div>Count: {state.count}</div>
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>

      {/* <div>Accumulator: {currentAccumulator}</div>
      <button onClick={() => callReducer(1)}>Increment</button> */}
      <input type="number" onChange={e => dispatch({ type: 'custom', payload: parseInt(e.target.value) })} />
    </>
  );
};

export default Example;
