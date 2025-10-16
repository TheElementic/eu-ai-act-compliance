// src/api/appApi.js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// helpers
function applyWhere(q, where = {}) {
  for (const [k, v] of Object.entries(where)) q = q.eq(k, v);
  return q;
}
function applyOrder(q, order = "-created_date") {
  if (!order) return q;
  const asc = !order.startsWith("-");
  const col = asc ? order : order.slice(1);
  return q.order(col, { ascending: asc });
}
async function run(q, limit = null) {
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

// API with the same surface you used before
const api = {
  Assessment: {
    async create(data) {
      const { data: row, error } = await supabase
        .from("assessments")
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return row;
    },
    async filter(where = {}, order = "-created_date", limit = 100) {
      let q = supabase.from("assessments").select("*");
      q = applyWhere(q, where);
      q = applyOrder(q, order);
      return run(q, limit);
    },
  },
  ComplianceItem: {
    async filter(where = {}, order = "-created_date", limit = 100) {
      let q = supabase.from("compliance_items").select("*");
      q = applyWhere(q, where);
      q = applyOrder(q, order);
      return run(q, limit);
    },
  },
  auth: {},
};

export { api };      // named export
export default api;  // default export (safer for imports)
