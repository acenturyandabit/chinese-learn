import * as React from "react";
export const useLocalStorageSavedState = <T>(
  localStorageKey: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const storedValue = localStorage.getItem(localStorageKey);
  if (storedValue) {
    try {
      Object.assign(initialValue as Object, JSON.parse(storedValue));
    } catch (e) {
      console.log(`Lost initial value; was ${storedValue}`);
    }
  }
  const [data, setData] = React.useState<T>(initialValue);
  const proxiedSetData = (valueOrFunctor: T | ((old: T) => T)) => {
    setData((old) => {
      let newValue: T;
      if (valueOrFunctor instanceof Function) {
        newValue = valueOrFunctor(old);
      } else {
        newValue = valueOrFunctor;
      }
      localStorage.setItem(localStorageKey, JSON.stringify(newValue));
      return newValue;
    });
  };
  return [data, proxiedSetData];
};