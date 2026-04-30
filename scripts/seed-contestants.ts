import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { contestants } from "../lib/data/contestants";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

async function main() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const rows = contestants.map((c, i) => ({
    id: c.id,
    name: c.name,
    ciudad: c.ciudad,
    bio: c.bio,
    image: c.image,
    sort_order: i
  }));

  const { error, count } = await supabase
    .from("contestants")
    .upsert(rows, { onConflict: "id", count: "exact" });

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${count ?? rows.length} contestant rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
