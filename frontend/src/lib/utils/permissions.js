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
    "subaccounts.view",
    "subaccounts.create",
    "subaccounts.delete",
    "idr.view",
    "idr.create",
    "idr.delete",
    "calculator.view",
    "partners.view",
    "partners.manage",
    "admin.register",
  ],
  admin: [
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
    "subaccounts.view",
    "subaccounts.create",
    "subaccounts.delete",
    "idr.view",
    "idr.create",
    "idr.delete",
    "calculator.view",
    "partners.view",
    "partners.manage",
    "admin.register",
  ],
  staff: [
    "dashboard.view",
    "usdt.view",
    "usdt.create",
    "expense.view",
    "expense.create",
    "buy.view",
    "buy.create",
    "sell.view",
    "sell.create",
    "subaccounts.view",
    "subaccounts.create",
    "idr.view",
    "idr.create",
    "calculator.view",
    "partners.view",
  ],
  viewer: [
    "dashboard.view",
    "usdt.view",
    "expense.view",
    "buy.view",
    "sell.view",
    "subaccounts.view",
    "idr.view",
    "calculator.view",
    "partners.view",
  ],
};

export function can(user, permission) {
  if (!user) return false;

  const role = user.role || "staff";

  if (role === "owner" || role === "admin") return true;

  if (Array.isArray(user.permissions)) {
    return user.permissions.includes(permission);
  }

  const allowed = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.staff;
  return allowed.includes(permission);
}
