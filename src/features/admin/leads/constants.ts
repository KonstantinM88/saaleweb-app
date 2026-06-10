export const LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"] as const;
export type LeadStatusValue = (typeof LEAD_STATUSES)[number];
