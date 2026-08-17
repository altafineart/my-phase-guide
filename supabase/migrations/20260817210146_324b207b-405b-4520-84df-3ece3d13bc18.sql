CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  idade INT,
  fase_menopausa TEXT,
  ultima_menstruacao DATE,
  sintomas_predominantes JSONB NOT NULL DEFAULT '[]'::jsonb,
  onboarding_completo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.entitlements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  produto TEXT NOT NULL DEFAULT 'guia_menopausa',
  ativo BOOLEAN NOT NULL DEFAULT true,
  origem_kiwify_order_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, produto)
);
GRANT SELECT ON public.entitlements TO authenticated;
GRANT ALL ON public.entitlements TO service_role;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "entitlements_select_own" ON public.entitlements FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.registros_diario (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  calorao BOOLEAN NOT NULL DEFAULT false,
  intensidade_calorao INT NOT NULL DEFAULT 0,
  sono INT NOT NULL DEFAULT 3,
  humor INT NOT NULL DEFAULT 3,
  energia INT NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, data)
);
CREATE INDEX registros_diario_user_data_idx ON public.registros_diario (user_id, data DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registros_diario TO authenticated;
GRANT ALL ON public.registros_diario TO service_role;
ALTER TABLE public.registros_diario ENABLE ROW LEVEL SECURITY;
CREATE POLICY "registros_select_own" ON public.registros_diario FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "registros_insert_own" ON public.registros_diario FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "registros_update_own" ON public.registros_diario FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "registros_delete_own" ON public.registros_diario FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER registros_set_updated_at BEFORE UPDATE ON public.registros_diario FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();