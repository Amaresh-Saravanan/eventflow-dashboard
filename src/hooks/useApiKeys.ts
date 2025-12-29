import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
}

// Simple hash function for demo (in production use proper crypto)
const hashKey = async (key: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};

const generateRandomKey = (): string => {
  return Array.from({ length: 24 }, () => 
    "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]
  ).join("");
};

export const useApiKeys = () => {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApiKeys = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, name, key_prefix, created_at, last_used_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching API keys:", error);
    } else {
      setApiKeys(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApiKeys();
  }, [user]);

  const createApiKey = async (name: string): Promise<string | null> => {
    if (!user) return null;

    const rawKey = `wh_live_${generateRandomKey()}`;
    const keyHash = await hashKey(rawKey);
    const keyPrefix = rawKey.substring(0, 12);

    const { data, error } = await supabase
      .from("api_keys")
      .insert({
        user_id: user.id,
        name,
        key_hash: keyHash,
        key_prefix: keyPrefix,
      })
      .select("id, name, key_prefix, created_at, last_used_at")
      .single();

    if (error) {
      console.error("Error creating API key:", error);
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
      return null;
    }

    setApiKeys(prev => [data, ...prev]);
    return rawKey; // Return the full key only once
  };

  const deleteApiKey = async (id: string) => {
    const { error } = await supabase
      .from("api_keys")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting API key:", error);
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
      return false;
    }

    setApiKeys(prev => prev.filter(k => k.id !== id));
    return true;
  };

  return {
    apiKeys,
    loading,
    createApiKey,
    deleteApiKey,
    refetch: fetchApiKeys,
  };
};
