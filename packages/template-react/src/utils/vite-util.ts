if ((import.meta as any).env) {
  const processEnv = Object.entries((import.meta as any).env).reduce(
    (processEnv, [key, value]) => {
      processEnv[key] = value;
      if (key.startsWith("VITE_")) {
        const shortKey = key.slice(5);
        if (!Object.hasOwnProperty.call(processEnv, shortKey)) {
          processEnv[shortKey] = value;
        }
      }
      return processEnv;
    },
    {} as any
  );
  Object.defineProperty(window, "process", {
    configurable: true,
    enumerable: true,
    writable: false,
    value: {
      env: processEnv,
    },
  });
}
