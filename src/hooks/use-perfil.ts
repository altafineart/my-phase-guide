import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUsuario() {
  return useQuery({
    queryKey: ["usuario"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user ?? null;
    },
  });
}

export function usePerfil() {
  return useQuery({
    queryKey: ["perfil"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", auth.user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useAcesso() {
  return useQuery({
    queryKey: ["entitlement"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entitlements")
        .select("*")
        .eq("produto", "guia_menopausa")
        .eq("ativo", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}
