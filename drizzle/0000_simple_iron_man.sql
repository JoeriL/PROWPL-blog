CREATE TABLE `contributions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`activity_count` integer DEFAULT 1 NOT NULL,
	`intensity_level` integer DEFAULT 1 NOT NULL,
	`hours_logged` real DEFAULT 8 NOT NULL,
	`highlight` text,
	`daily_log_id` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`daily_log_id`) REFERENCES `daily_logs`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contributions_date_unique` ON `contributions` (`date`);--> statement-breakpoint
CREATE TABLE `daily_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`content` text NOT NULL,
	`hours_worked` real DEFAULT 8 NOT NULL,
	`category` text DEFAULT 'Feature Development' NOT NULL,
	`mood` text DEFAULT 'productive' NOT NULL,
	`accomplishments` text DEFAULT '[]' NOT NULL,
	`skills` text DEFAULT '[]' NOT NULL,
	`challenges` text,
	`learnings` text,
	`mentor_feedback` text,
	`is_published` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_logs_date_unique` ON `daily_logs` (`date`);--> statement-breakpoint
CREATE TABLE `internship_goals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`category` text DEFAULT 'Technical' NOT NULL,
	`status` text DEFAULT 'in_progress' NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`target_date` text,
	`completed_date` text,
	`created_at` text NOT NULL
);
