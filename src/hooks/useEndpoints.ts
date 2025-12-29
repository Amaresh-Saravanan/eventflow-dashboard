import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface Endpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  status: "active" | "inactive";
  events_count: number;
  last_event_at: string | null;
  created_at: string;
}

export const useEndpoints = () => {
  const { user } = useAuth();
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEndpoints = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("endpoints")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching endpoints:", error);
      toast({
        title: "Error",
        description: "Failed to fetch endpoints",
        variant: "destructive",
      });
    } else {
      setEndpoints((data || []) as Endpoint[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEndpoints();
  }, [user]);

  const createEndpoint = async (name: string, url: string, method: string = "POST") => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("endpoints")
      .insert({
        user_id: user.id,
        name,
        url,
        method,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating endpoint:", error);
      toast({
        title: "Error",
        description: "Failed to create endpoint",
        variant: "destructive",
      });
      return null;
    }

    setEndpoints(prev => [data as Endpoint, ...prev]);
    return data;
  };

  const updateEndpoint = async (id: string, updates: Partial<Endpoint>) => {
    const { error } = await supabase
      .from("endpoints")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating endpoint:", error);
      toast({
        title: "Error",
        description: "Failed to update endpoint",
        variant: "destructive",
      });
      return false;
    }

    setEndpoints(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    return true;
  };

  const deleteEndpoint = async (id: string) => {
    const { error } = await supabase
      .from("endpoints")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting endpoint:", error);
      toast({
        title: "Error",
        description: "Failed to delete endpoint",
        variant: "destructive",
      });
      return false;
    }

    setEndpoints(prev => prev.filter(e => e.id !== id));
    return true;
  };

  return {
    endpoints,
    loading,
    createEndpoint,
    updateEndpoint,
    deleteEndpoint,
    refetch: fetchEndpoints,
  };
};
