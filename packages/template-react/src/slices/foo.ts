import {
  createSlice,
  takeCallback,
  takeEffect,
  takeMemo,
  takeState,
} from "raydux";

export const takeFoo = createSlice("foo", () => () => {
  // takeState
  const [count, setCount] = takeState(0);

  // takeMemo
  const countDouble = takeMemo(() => count * 2, [count]);

  // takeMemo can depend on other takeMemo, or even takeCallback
  const countText = takeMemo(
    () => `count: ${count}, doubleValue: ${countDouble}`,
    [count, countDouble]
  );

  // takeCallback sync with deps
  const increment = takeCallback(() => {
    setCount(count + 1);
  }, [count]);

  // takeCallback async without deps
  const incrementAsync = takeCallback(async () => {
    setCount((prev) => prev + 1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCount((prev) => prev + 1);
  }, []);

  // takeCallback with parameters and return
  const incrementMultiTimes = takeCallback((times: number) => {
    // setState will return newest state
    let curCount = setCount((count) => count);
    for (let i = 0; i < times; i++) {
      curCount = setCount((prev) => prev + 1);
    }
    return curCount;
  }, []);

  // takeEffect
  const [autoPlusCount, setAutoPlusCount] = takeState(0);
  takeEffect(() => {
    // plus 1 per second
    const id = setInterval(() => {
      setAutoPlusCount((prev) => prev + 1);
    }, 1000);

    // you should return a function to clear the side effects, even if it looks useless
    return () => {
      clearInterval(id);
    };
  }, []);

  // Return all you wang to export
  return {
    count,
    // if you want to hide a state, just not return it
    // countDouble,
    countText,
    increment,
    incrementAsync,
    incrementMultiTimes,
    autoPlusCount,
  };
});
