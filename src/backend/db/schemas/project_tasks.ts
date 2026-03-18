// src/backend/db/schemas/project_tasks.ts

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// ============================================================================
// Types for JSON Columns
// ============================================================================

export type ArchitecturePlan = {
  explanation: string;
  mermaid_diagram: string;
};

export type FileInstruction = {
  action: 'NEW' | 'MODIFY' | 'DELETE';
  file_path: string;
  instructions: string[];
};

export type ProposedChange = {
  category: string;
  files: FileInstruction[];
};

export type AutomatedTest = {
  command: string;
  expected_outcome: string;
};

export type VerificationPlan = {
  automated_tests: AutomatedTest[];
  manual_verification: string[];
};

export type ImplementationPlan = {
  title: string;
  description: string;
  architecture: ArchitecturePlan;
  proposed_changes: ProposedChange[];
  verification_plan: VerificationPlan;
};

// ============================================================================
// Tables
// ============================================================================

export const projects = sqliteTable('projects', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  generatedDate: integer('generated_date', { mode: 'timestamp' }).notNull(),
  totalPhases: integer('total_phases').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const epics = sqliteTable('epics', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  epicNumber: integer('epic_number').notNull(), // Maps to phase_number
  title: text('title').notNull(),
  description: text('description').notNull(),
  successCriteria: text('success_criteria', { mode: 'json' }).$type<string[]>(),
  implementationPlan: text('implementation_plan', { mode: 'json' }).$type<ImplementationPlan>(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const stories = sqliteTable('stories', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  epicId: text('epic_id')
    .notNull()
    .references(() => epics.id, { onDelete: 'cascade' }),
  storyNumber: integer('story_number').notNull(), // Maps to task_number
  status: text('status').notNull().default('not_started'),
  agentAssigned: text('agent_assigned').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  dependencies: text('dependencies', { mode: 'json' }).$type<string[]>(),
  cloudflareDocsQueries: text('cloudflare_docs_queries', { mode: 'json' }).$type<string[]>(),
  requirements: text('requirements', { mode: 'json' }).$type<string[]>(),
  agentRules: text('agent_rules', { mode: 'json' }).$type<string[]>(),
  successCriteria: text('success_criteria', { mode: 'json' }).$type<string[]>(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const steps = sqliteTable('steps', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  storyId: text('story_id')
    .notNull()
    .references(() => stories.id, { onDelete: 'cascade' }),
  stepNumber: real('step_number').notNull(), // Real number to support 1.1, 1.2, etc.
  title: text('title').notNull(),
  status: text('status').notNull().default('not_started'),
  technicalRequirements: text('technical_requirements', { mode: 'json' }).$type<string[]>(),
  successCriteria: text('success_criteria', { mode: 'json' }).$type<string[]>(),
  validationCommand: text('validation_command'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ============================================================================
// Relations
// ============================================================================

export const projectsRelations = relations(projects, ({ many }) => ({
  epics: many(epics),
  stories: many(stories),
  steps: many(steps),
}));

export const epicsRelations = relations(epics, ({ one, many }) => ({
  project: one(projects, {
    fields: [epics.projectId],
    references: [projects.id],
  }),
  stories: many(stories),
}));

export const storiesRelations = relations(stories, ({ one, many }) => ({
  project: one(projects, {
    fields: [stories.projectId],
    references: [projects.id],
  }),
  epic: one(epics, {
    fields: [stories.epicId],
    references: [epics.id],
  }),
  steps: many(steps),
}));

export const stepsRelations = relations(steps, ({ one }) => ({
  project: one(projects, {
    fields: [steps.projectId],
    references: [projects.id],
  }),
  story: one(stories, {
    fields: [steps.storyId],
    references: [stories.id],
  }),
}));

// ============================================================================
// Zod Validation Schemas
// ============================================================================

export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);

export const insertEpicSchema = createInsertSchema(epics);
export const selectEpicSchema = createSelectSchema(epics);

export const insertStorySchema = createInsertSchema(stories);
export const selectStorySchema = createSelectSchema(stories);

export const insertStepSchema = createInsertSchema(steps);
export const selectStepSchema = createSelectSchema(steps);
