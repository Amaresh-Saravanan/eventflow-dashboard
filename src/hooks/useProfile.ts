import { useUser } from "@clerk/clerk-react";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user, isLoaded } = useUser();

  const profile: Profile | null = user ? {
    id: user.id,
    full_name: user.fullName,
    email: user.primaryEmailAddress?.emailAddress || null,
    created_at: user.createdAt?.toISOString() || new Date().toISOString(),
    updated_at: user.updatedAt?.toISOString() || new Date().toISOString(),
  } : null;

  const updateProfile = async (updates: Partial<Pick<Profile, "full_name" | "email">>) => {
    if (!user) return false;

    try {
      await user.update({
        firstName: updates.full_name?.split(" ")[0] || undefined,
        lastName: updates.full_name?.split(" ").slice(1).join(" ") || undefined,
      });
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  };

  return {
    profile,
    loading: !isLoaded,
    updateProfile,
    refetch: () => {},
  };
};
