import { createFileRoute } from "@tanstack/react-router";

const PRODUTO = "guia_menopausa";
const APP_REDIRECT_URL = "https://segundaprimavera.lovable.app/app";

function pick(...vals: unknown[]): string | undefined {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

export const Route = createFileRoute("/api/public/kiwify-webhook")({
  server: {
    handlers: {
      OPTIONS: async () => {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      },
      POST: async ({ request }) => {
        const WEBHOOK_SECRET = process.env["KIWIFY_WEBHOOK_SECRET"];
        if (!WEBHOOK_SECRET) {
          console.error("kiwify-webhook: KIWIFY_WEBHOOK_SECRET não configurado");
          return new Response(JSON.stringify({ ok: false, reason: "missing webhook secret" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const url = new URL(request.url);
        const secret = url.searchParams.get("secret");
        if (secret !== WEBHOOK_SECRET) {
          return new Response("Unauthorized", { status: 401 });
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        console.log("kiwify-webhook payload:", JSON.stringify(body));

        const typedBody = body as Record<string, unknown> | undefined;

        const email = pick(
          (typedBody?.Customer as Record<string, unknown>)?.email,
          (typedBody?.customer as Record<string, unknown>)?.email,
          (typedBody?.data as Record<string, unknown>)?.Customer?.email,
          (typedBody?.data as Record<string, unknown>)?.customer?.email,
          typedBody?.buyer_email,
        );
        const fullName = pick(
          (typedBody?.Customer as Record<string, unknown>)?.full_name,
          (typedBody?.customer as Record<string, unknown>)?.full_name,
          (typedBody?.data as Record<string, unknown>)?.Customer?.full_name,
          (typedBody?.data as Record<string, unknown>)?.customer?.full_name,
        );
        const orderId = pick(
          typedBody?.order_id,
          (typedBody?.data as Record<string, unknown>)?.order_id,
          (typedBody?.order as Record<string, unknown>)?.id,
        );
        const orderStatus = pick(
          typedBody?.order_status,
          (typedBody?.data as Record<string, unknown>)?.order_status,
          typedBody?.webhook_event_type,
        );

        if (!email) {
          console.error("kiwify-webhook: e-mail do comprador não encontrado no payload", body);
          return new Response(JSON.stringify({ ok: false, reason: "email not found" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (orderStatus && !/paid|approved|aprovad/i.test(orderStatus)) {
          console.log(`kiwify-webhook: ignorando evento com status "${orderStatus}"`);
          return new Response(JSON.stringify({ ok: true, ignored: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        let userId: string | undefined;

        const { data: invited, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
          data: fullName ? { full_name: fullName } : undefined,
          redirectTo: APP_REDIRECT_URL,
        });

        if (invited?.user?.id) {
          userId = invited.user.id;
        } else {
          console.log("kiwify-webhook: inviteUserByEmail não criou usuário novo:", inviteError?.message);
          const { data: existingProfile, error: profileError } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("email", email)
            .maybeSingle();

          if (profileError) {
            console.error("kiwify-webhook: erro buscando profile existente", profileError);
          }
          userId = existingProfile?.id;
        }

        if (!userId) {
          console.error("kiwify-webhook: não foi possível resolver o user_id para", email);
          return new Response(JSON.stringify({ ok: false, reason: "user resolution failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { error: entitlementError } = await supabaseAdmin
          .from("entitlements")
          .upsert(
            {
              user_id: userId,
              produto: PRODUTO,
              ativo: true,
              origem_kiwify_order_id: orderId ?? null,
            },
            { onConflict: "user_id,produto" },
          );

        if (entitlementError) {
          console.error("kiwify-webhook: erro liberando entitlement", entitlementError);
          return new Response(JSON.stringify({ ok: false, reason: "entitlement upsert failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        console.log(`kiwify-webhook: acesso liberado para ${email} (order ${orderId ?? "?"})`);
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
});
