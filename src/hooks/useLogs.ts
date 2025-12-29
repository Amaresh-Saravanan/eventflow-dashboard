import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

export interface LogEntry {
  id: string;
  level: "info" | "warn" | "error";
  message: string;
  source: string;
  metadata: Json | null;
  created_at: string;
}

export const useLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching logs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch logs",
        variant: "destructive",
      });
    } else {
      setLogs((data || []) as LogEntry[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();

    // Set up realtime subscription
    const channel = supabase
      .channel("logs-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "logs",
        },
        (payload) => {
          setLogs(prev => [payload.new as LogEntry, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const createLog = async (level: "info" | "warn" | "error", message: string, source: string, metadata?: Json) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("logs")
      .insert([{
        user_id: user.id,
        level,
        message,
        source,
        metadata: metadata ?? null,
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating log:", error);
      return null;
    }

    return data;
  };

  return {
    logs,
    loading,
    createLog,
    refetch: fetchLogs,
  };
};
