export const Role = {
  Admin: "Admin",
  Staff: "Staff",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];
