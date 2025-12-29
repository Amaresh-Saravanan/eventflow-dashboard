import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    } else {
      setProfile((data as Profile) ?? null);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, authLoading]);

  const updateProfile = async (updates: Partial<Pick<Profile, "full_name" | "email">>) => {
    if (!user) return false;

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        ...updates,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return false;
    }

    setProfile(data as Profile);
    return true;
  };

  return {
    profile,
    loading: authLoading || loading,
    updateProfile,
    refetch: fetchProfile,
  };
};

