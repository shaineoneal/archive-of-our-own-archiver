import { create } from 'zustand';

export type StoreState = {};
const useStore = create<StoreState>()(
  (...data) => ({}),
);

export * from './tokenSlice';
export * from './useStore';
export default useStore;
