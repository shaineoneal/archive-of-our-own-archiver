import { useState } from 'react';

export function useSetState<S extends object >(
    initialState: S | (() => S)
) {
      const [state, setState] = useState<S>(initialState);

      async function getState(): Promise<S> {
          var state;
      
          await setState((currentState: S) => {
              state = currentState;
              return currentState;
          });

          return state!;
      }

  return [state, setState, getState] as [S, React.Dispatch<React.SetStateAction<S>>, () => S];
}