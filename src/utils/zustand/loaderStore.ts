import { create } from 'zustand';

type LoaderStateType = {
    loader: boolean
    setLoader: (loader: boolean) => void;
};

export const useLoaderStore = create<LoaderStateType>()(
    (set) => ({
        loader: true,
        setLoader: (loader: boolean) => set({ loader })
    })
);