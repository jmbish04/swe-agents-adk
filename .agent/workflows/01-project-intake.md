# Project Intake Workflow
1. **Product Manager Agent** receives natural language prompt.
2. Generates `app_id` and saves to `applications` table.
3. Scopes epics and user stories, saving them to `project_tasks` table.
4. Dispatches tasks via RPC to the relevant specialized agents.
5. Updates the shared WebSocket pub/sub channel.
