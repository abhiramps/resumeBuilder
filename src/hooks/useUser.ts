/**
 * User Profile Hooks
 * React Query hooks for user profile operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { QUERY_KEYS } from '../config/react-query.config';
import type { UpdateProfileRequest } from '../types/api.types';

/**
 * Hook to get user profile
 */
export const useUserProfile = () => {
    return useQuery({
        queryKey: QUERY_KEYS.USER_PROFILE,
        queryFn: () => userService.getProfile(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileRequest) => userService.updateProfile(data),
        onSuccess: (updatedProfile) => {
            // Update profile in cache
            queryClient.setQueryData(QUERY_KEYS.USER_PROFILE, updatedProfile);

            // Also update session user data
            queryClient.setQueryData(QUERY_KEYS.SESSION, (old: any) => ({
                ...old,
                user: {
                    ...old?.user,
                    fullName: updatedProfile.fullName,
                    avatarUrl: updatedProfile.avatarUrl,
                },
            }));
        },
    });
};

/**
 * Hook to delete user account
 */
export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => userService.deleteAccount(),
        onSuccess: () => {
            // Clear all cached data
            queryClient.clear();

            // Redirect to home page
            window.location.href = '/';
        },
    });
};
