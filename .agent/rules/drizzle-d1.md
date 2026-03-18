All schema IDs must utilize $defaultFn(() => crypto.randomUUID()). No randomblob() usage for standard UUIDs in Cloudflare.

Dates must use integer({ mode: 'timestamp' }).

All tables in the hierarchy must store a project_id foreign key.

Arrays and complex nested data maps must use text({ mode: 'json' }).$type<CustomType>().
