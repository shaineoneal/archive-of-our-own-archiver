import { createContext, useState } from "react";
import { useToggle } from 'usehooks-ts';

export type LoaderStateType = {
  loader: boolean;
  setLoader: (loader: boolean) => void;
};

export const LoaderContext = createContext<LoaderStateType>({
  loader: false,
  setLoader: () => {},
});

type Props = {
  children: JSX.Element | JSX.Element[];
};

export function LoaderProvider({ children }: Props) {
  const [ loader, setLoader ] = useState<boolean>(true);

  return (
    <LoaderContext.Provider value={{ loader, setLoader }}>
      {children}
    </LoaderContext.Provider>
  );
}