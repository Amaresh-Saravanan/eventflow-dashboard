import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface Event {
  id: string;
  event_id: string;
  endpoint_id: string | null;
  endpoint_name: string;
  event_type: string;
  status: "success" | "failed" | "pending";
  duration: number | null;
  payload: Record<string, unknown> | null;
  response: Record<string, unknown> | null;
  headers: Record<string, unknown> | null;
  created_at: string;
}

export const useEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    } else {
      setEvents((data || []) as Event[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();

    // Set up realtime subscription
    const channel = supabase
      .channel("events-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "events",
        },
        (payload) => {
          setEvents(prev => [payload.new as Event, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getEventById = async (eventId: string) => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("event_id", eventId)
      .single();

    if (error) {
      console.error("Error fetching event:", error);
      return null;
    }

    return data;
  };

  return {
    events,
    loading,
    getEventById,
    refetch: fetchEvents,
  };
};
