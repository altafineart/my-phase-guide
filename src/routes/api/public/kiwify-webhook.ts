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

        let body: any;
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        console.log("kiwify-webhook payload:", JSON.stringify(body));

        const email = pick(
          body?.["Customer"]?.["email"],
          body?.["customer"]?.["email"],
          body?.["data"]?.["Customer"]?.["email"],
          body?.["data"]?.["customer"]?.["email"],
          body?.["buyer_email"],
        );
        const fullName = pick(
          body?.["Customer"]?.["full_name"],
          body?.["customer"]?.["full_name"],
          body?.["data"]?.["Customer"]?.["full_name"],
          body?.["data"]?.["customer"]?.["full_name"],
        );
        const orderId = pick(
          body?.["order_id"],
          body?.["data"]?.["order_id"],
          body?.["order"]?.["id"],
        );
        const orderStatus = pick(
          body?.["order_status"],
          body?.["data"]?.["order_status"],
          body?.["webhook_event_type"],
        );

        if (!email) {
          console.error("kiwify-webhook: e-mail do comprador não encontrado no payload", body);
          return new Response(JSON.stringify({ ok: false, reason: "email not found" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        if (orderStatus && /refund|reembols|chargeback|estorn/i.test(orderStatus)) {
          const { data: existingProfile, error: profileError } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("email", email)
            .maybeSingle();

          if (profileError) {
            console.error("kiwify-webhook: erro buscando profile para revogação", profileError);
          }

          if (existingProfile?.id) {
            const { error: revokeError } = await supabaseAdmin
              .from("entitlements")
              .update({ ativo: false })
              .eq("user_id", existingProfile.id)
              .eq("produto", PRODUTO);

            if (revokeError) {
              console.error("kiwify-webhook: erro revogando entitlement", revokeError);
            } else {
              console.log(`kiwify-webhook: acesso revogado para ${email} (status "${orderStatus}")`);
            }
          } else {
            console.log(`kiwify-webhook: reembolso/chargeback para e-mail sem conta: ${email}`);
          }

          return new Response(JSON.stringify({ ok: true, revoked: true }), {
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

        let userId: string | undefined;

        const inviteOptions: { data?: object; redirectTo: string } = {
          redirectTo: APP_REDIRECT_URL,
        };
        if (fullName) {
          inviteOptions.data = { full_name: fullName };
        }

        const { data: invited, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
          email,
          inviteOptions,
        );

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
