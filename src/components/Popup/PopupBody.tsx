import { GoToSheetButton, LoginButton } from '@/components';
import { useTokens } from '@/stores';

/**
 * Popup body component that:
 * - Loads the current user state.
 * - Ensures access tokens are present and valid (refreshing if needed).
 * - Shows a loader while auth state is resolved.
 * - Shows login or navigation CTA based on auth state.
 *
 * @remarks
 * Render states:
 * - Loader while auth state is resolving.
 * - Login button if any required auth field is missing.
 * - Go-to-sheet button if user is authenticated.
 */
export const PopupBody = () => {
    const { accessToken } = useTokens();

    /**
     * Render states:
     * - Loader while auth state is resolving.
     * - Login button if any required auth field is missing.
     * - Go-to-sheet button if user is authenticated.
     */
    return accessToken
        ? <GoToSheetButton />
        : <LoginButton />;
};