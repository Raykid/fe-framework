import {
  createService,
  takeCallback,
  takeEffect,
  takeMemo,
  takeState,
} from "raydux";

export const takeFoo = createService("foo", () => () => {
  // takeState
  const [count, setCount] = takeState(0);

  // takeMemo
  const countDouble = takeMemo(() => count * 2, [count]);

  // takeMemo can depend on other takeMemo, or even takeCallback
  const countText = takeMemo(
    () => `count: ${count}, doubleValue: ${countDouble}`,
    [count, countDouble]
  );

  // takeCallback async
  const incrementTwice = takeCallback(async (num: number) => {
    setCount((prev) => prev + num);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCount((prev) => prev + num);
  }, []);

  // takeCallback sync
  const incrementMultiTimes = takeCallback((times: number) => {
    for (let i = 0; i < times; i++) {
      setCount((prev) => prev + 1);
    }
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

  return {
    count,
    // if you want to hide a state, just not return it
    // countDouble,
    countText,
    setCount,
    incrementTwice,
    incrementMultiTimes,
    autoPlusCount,
  };
});
