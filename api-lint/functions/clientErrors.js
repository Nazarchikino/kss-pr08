// Кожна операція описує хоча б одну помилку клієнта (4xx);
// захищена операція описує 401 Unauthorized.
const METHODS = ["get", "post", "put", "patch", "delete"];

export default (doc) => {
  const errors = [];
  const globalSecurity = doc?.security ?? [];
  for (const [path, item] of Object.entries(doc?.paths ?? {})) {
    for (const m of METHODS) {
      const op = item?.[m];
      if (!op) continue;
      const codes = Object.keys(op.responses ?? {});
      const at = ["paths", path, m, "responses"];
      if (!codes.some((c) => /^4/.test(c))) {
        errors.push({ message: "Опишіть хоча б одну відповідь 4xx", path: at });
      }
      const security = op.security ?? globalSecurity;
      const secured = security.some((req) => Object.keys(req).length > 0);
      if (secured && !codes.includes("401")) {
        errors.push({ message: "Захищена операція має описувати відповідь 401", path: at });
      }
    }
  }
  return errors;
};
