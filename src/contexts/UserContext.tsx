import { createContext, useContext, ReactNode } from "react";
import { useProfile } from "@/hooks/useProfile";

interface UserProfile {
  fullName: string;
  email: string;
  initials: string;
}

interface UserContextType {
  user: UserProfile;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const getInitials = (name: string | null | undefined): string => {
  if (!name) return "??";
  const names = name.trim().split(" ");
  return names.length >= 2
    ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
    : names[0].substring(0, 2).toUpperCase();
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { profile, loading } = useProfile();

  const user: UserProfile = {
    fullName: profile?.full_name || "User",
    email: profile?.email || "",
    initials: getInitials(profile?.full_name),
  };

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
