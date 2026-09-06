import { pgTable, uuid, text, numeric, timestamp, integer, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const touristSpots = pgTable('tourist_spots', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  category: text('category').notNull(), // 'Waterfall', 'Cave & Hill', 'Thermal Spring', 'Park & Heritage'
  description: text('description').notNull(),
  longDescription: text('long_description'),
  latitude: numeric('latitude', { precision: 10, scale: 6 }).notNull(),
  longitude: numeric('longitude', { precision: 10, scale: 6 }).notNull(),
  coverImage: text('cover_image').notNull(),
  headerImage: text('header_image'), // Separate header background for detail page
  galleryImages: json('gallery_images').$type<string[]>().default([]),
  bestTimeToVisit: text('best_time_to_visit'),
  distanceFromPakurStation: text('distance_from_pakur_station'),
  entryFee: text('entry_fee'),
  timing: text('timing'),
  nearestRailway: text('nearest_railway'),
  highlights: json('highlights').$type<string[]>().default([]),
  culturalNote: text('cultural_note'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const visitorReviews = pgTable('visitor_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  spotId: uuid('spot_id').references(() => touristSpots.id, { onDelete: 'cascade' }),
  userName: text('user_name').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  visitDate: text('visit_date'),
  userLocation: text('user_location'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const touristSpotsRelations = relations(touristSpots, ({ many }) => ({
  reviews: many(visitorReviews),
}));

export const visitorReviewsRelations = relations(visitorReviews, ({ one }) => ({
  spot: one(touristSpots, {
    fields: [visitorReviews.spotId],
    references: [touristSpots.id],
  }),
}));

export type TouristSpotRow = typeof touristSpots.$inferSelect;
export type NewTouristSpotRow = typeof touristSpots.$inferInsert;
export type VisitorReviewRow = typeof visitorReviews.$inferSelect;
export type NewVisitorReviewRow = typeof visitorReviews.$inferInsert;
