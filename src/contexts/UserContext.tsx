import { createContext, useContext, useState, ReactNode } from "react";

interface UserProfile {
  fullName: string;
  email: string;
  initials: string;
}

interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>({
    fullName: "John Doe",
    email: "john@example.com",
    initials: "JD",
  });

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      const newUser = { ...prev, ...updates };
      // Auto-generate initials from name
      if (updates.fullName) {
        const names = updates.fullName.trim().split(" ");
        newUser.initials = names.length >= 2 
          ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
          : names[0].substring(0, 2).toUpperCase();
      }
      return newUser;
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
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
