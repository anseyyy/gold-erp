/**
 * Permission utility for Creston
 *
 * NOTE: Frontend permission checks improve UX by hiding unauthorized actions,
 * but the backend API remains the authoritative source of truth for authorization.
 */

const ROLE_PERMISSIONS = {
  owner: [
    "dashboard.view",
    "usdt.view",
    "usdt.create",
    "usdt.delete",
    "expense.view",
    "expense.create",
    "expense.delete",
    "buy.view",
    "buy.create",
    "buy.delete",
    "sell.view",
    "sell.create",
    "sell.delete",
    "podiyana.view",
    "podiyana.create",
    "podiyana.delete",
    "pudiyana.view",
    "pudiyana.create",
    "pudiyana.delete",
    "idr.view",
    "idr.create",
    "idr.delete",
    "calculator.view",
    "partners.view",
    "partners.manage",
  ],
  employee: [
    "dashboard.view",
    "usdt.view",
    "usdt.create",
    "expense.view",
    "expense.create",
    "buy.view",
    "buy.create",
    "sell.view",
    "sell.create",
    "podiyana.view",
    "podiyana.create",
    "pudiyana.view",
    "pudiyana.create",
    "idr.view",
    "idr.create",
    "calculator.view",
    "partners.view",
  ],
};

export function can(user, permission) {
  if (!user) return false;

  const role = user.role || "employee";

  if (role === "owner") return true;

  // Custom user permissions override if present
  if (Array.isArray(user.permissions)) {
    return user.permissions.includes(permission);
  }

  const allowed = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.employee;
  return allowed.includes(permission);
}
