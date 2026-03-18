CREATE TABLE `epics` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`epic_number` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`success_criteria` text,
	`implementation_plan` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`generated_date` integer NOT NULL,
	`total_phases` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `steps` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`story_id` text NOT NULL,
	`step_number` real NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'not_started' NOT NULL,
	`technical_requirements` text,
	`success_criteria` text,
	`validation_command` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`story_id`) REFERENCES `stories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `stories` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`epic_id` text NOT NULL,
	`story_number` integer NOT NULL,
	`status` text DEFAULT 'not_started' NOT NULL,
	`agent_assigned` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`dependencies` text,
	`cloudflare_docs_queries` text,
	`requirements` text,
	`agent_rules` text,
	`success_criteria` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`epic_id`) REFERENCES `epics`(`id`) ON UPDATE no action ON DELETE cascade
);
