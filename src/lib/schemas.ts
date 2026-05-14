import { z } from "zod";

export const campusEventSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  time: z.string(),
  location: z.string(),
  attendees: z.number(),
  category: z.string(),
  image: z.string().optional(),
});

export type CampusEvent = z.infer<typeof campusEventSchema>;

export const campusClubSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  members: z.number(),
  rating: z.number(),
  tags: z.array(z.string()),
  image: z.string().optional(),
});

export type CampusClub = z.infer<typeof campusClubSchema>;

export const resourceIconKeySchema = z.enum(["bookOpen", "users", "calendar"]);

export type ResourceIconKey = z.infer<typeof resourceIconKeySchema>;

export const campusResourceSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  location: z.string().optional(),
  hours: z.string().optional(),
  contact: z.string().optional(),
  iconKey: resourceIconKeySchema,
});

export type CampusResource = z.infer<typeof campusResourceSchema>;

export const recommendationKindSchema = z.enum(["Event", "Club", "Resource"]);

export type RecommendationKind = z.infer<typeof recommendationKindSchema>;

export const recommendationListItemSchema = z.object({
  kind: recommendationKindSchema,
  title: z.string(),
  description: z.string(),
  category: z.string(),
  detail: z.string(),
  meta: z.string(),
  actionLabel: z.string(),
});

export type RecommendationListItem = z.infer<typeof recommendationListItemSchema>;

export const recommendationTopPickSchema = z.object({
  title: z.string(),
  badgeLabel: z.string(),
  summary: z.string(),
  dateRange: z.string(),
  venue: z.string(),
  attendeesHeadline: z.string(),
  attendeesSubtext: z.string(),
});

export type RecommendationTopPick = z.infer<typeof recommendationTopPickSchema>;

export const recommendationsPayloadSchema = z.object({
  topPick: recommendationTopPickSchema,
  listItems: z.array(recommendationListItemSchema),
});

export type RecommendationsPayload = z.infer<typeof recommendationsPayloadSchema>;
