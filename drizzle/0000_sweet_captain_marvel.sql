CREATE TABLE `characters` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`concept` text DEFAULT '' NOT NULL,
	`game_line` text NOT NULL,
	`ruleset_id` text NOT NULL,
	`ruleset_version` integer DEFAULT 1 NOT NULL,
	`schema_version` integer DEFAULT 1 NOT NULL,
	`character_data` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `characters_owner_name_idx` ON `characters` (`owner_id`,`name`);--> statement-breakpoint
CREATE TABLE `rules` (
	`id` text PRIMARY KEY NOT NULL,
	`original_name` text NOT NULL,
	`translated_name` text,
	`category` text NOT NULL,
	`game_line` text NOT NULL,
	`source_id` text,
	`source_page` integer,
	`source_section` text,
	`source_type` text NOT NULL,
	`original_text` text,
	`translated_text` text,
	`structured_data` text DEFAULT '{}' NOT NULL,
	`review_status` text DEFAULT 'PENDING' NOT NULL,
	`needs_review` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rulesets` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`game_line` text NOT NULL,
	`config_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sources` (
	`id` text PRIMARY KEY NOT NULL,
	`filename` text NOT NULL,
	`title` text NOT NULL,
	`source_type` text NOT NULL,
	`edition` integer,
	`game_line` text NOT NULL,
	`language` text DEFAULT 'en' NOT NULL,
	`review_status` text DEFAULT 'PENDING' NOT NULL,
	`enabled` integer DEFAULT false NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`imported_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sources_filename_unique` ON `sources` (`filename`);--> statement-breakpoint
CREATE TABLE `translations` (
	`id` text PRIMARY KEY NOT NULL,
	`original_term` text NOT NULL,
	`translated_term` text,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `translations_original_term_unique` ON `translations` (`original_term`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);