import {useRef, useCallback} from 'react';

export default function useBoxedCallback(callback, ...args) {
  const box = useRef({callback, args});
  Object.assign(box.current, {callback, args});

  return useCallback(
    (...params) => {
      return box.current.callback(...params, ...box.current.args);
    },
    [box]
  );
}
