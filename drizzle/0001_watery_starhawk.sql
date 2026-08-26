ALTER TABLE `rules` ADD `review_notes` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `rules` ADD `reviewer_id` text;--> statement-breakpoint
ALTER TABLE `rules` ADD `reviewed_at` text;--> statement-breakpoint
ALTER TABLE `rules` ADD `updated_at` text;