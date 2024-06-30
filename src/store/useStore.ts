import { create } from 'zustand';
import createTokenSlice, { TokenSliceInterface } from './tokenSlice';


/**
 * Creates a store instance using the provided data.
 *
 * @param data - The data to be used for creating the store.
 * @returns The created store instance.
 * {@link createTokenSlice}
 */
export type StoreState = TokenSliceInterface;
const useStore = create<StoreState>()(
  (...data) => ({
    ...createTokenSlice(...data),
  }),
);

export default useStore; 