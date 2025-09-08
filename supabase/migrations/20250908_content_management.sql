-- Enable necessary extensions
create extension if not exists "vector" with schema "public";
create extension if not exists "pg_trgm" with schema "public";

-- Content Types enum
create type content_type as enum ('blog', 'case_study', 'product', 'update');
create type content_status as enum ('draft', 'published', 'archived');
create type supported_language as enum ('en-US', 'ar-AE');

-- Content Table
create table if not exists "public"."content" (
  "id" uuid not null default gen_random_uuid(),
  "slug" text not null,
  "type" content_type not null,
  "status" content_status not null default 'draft',
  "created_at" timestamp with time zone default timezone('utc'::text, now()),
  "updated_at" timestamp with time zone default timezone('utc'::text, now()),
  "published_at" timestamp with time zone,
  "author_id" uuid references auth.users(id),
  constraint content_pkey primary key (id),
  constraint content_slug_type_key unique (slug, type)
);

-- Content Translations
create table if not exists "public"."content_translations" (
  "id" uuid not null default gen_random_uuid(),
  "content_id" uuid not null references content(id) on delete cascade,
  "language" supported_language not null,
  "title" text not null,
  "description" text,
  "content" jsonb,
  "meta_title" text,
  "meta_description" text,
  "meta_keywords" text[],
  "created_at" timestamp with time zone default timezone('utc'::text, now()),
  "updated_at" timestamp with time zone default timezone('utc'::text, now()),
  constraint content_translations_pkey primary key (id),
  constraint content_translations_content_lang_key unique (content_id, language)
);

-- Content Categories
create table if not exists "public"."categories" (
  "id" uuid not null default gen_random_uuid(),
  "slug" text not null unique,
  "created_at" timestamp with time zone default timezone('utc'::text, now()),
  constraint categories_pkey primary key (id)
);

-- Category Translations
create table if not exists "public"."category_translations" (
  "id" uuid not null default gen_random_uuid(),
  "category_id" uuid not null references categories(id) on delete cascade,
  "language" supported_language not null,
  "name" text not null,
  "description" text,
  constraint category_translations_pkey primary key (id),
  constraint category_translations_cat_lang_key unique (category_id, language)
);

-- Content Categories Junction
create table if not exists "public"."content_categories" (
  "content_id" uuid not null references content(id) on delete cascade,
  "category_id" uuid not null references categories(id) on delete cascade,
  constraint content_categories_pkey primary key (content_id, category_id)
);

-- Search Index
create table if not exists "public"."search_index" (
  "id" uuid not null default gen_random_uuid(),
  "content_id" uuid not null references content(id) on delete cascade,
  "language" supported_language not null,
  "content_vector" vector(384),
  "text_search" tsvector,
  constraint search_index_pkey primary key (id),
  constraint search_index_content_lang_key unique (content_id, language)
);

-- Create indexes
create index content_slug_idx on content using btree (slug);
create index content_type_status_idx on content using btree (type, status);
create index content_published_idx on content using btree (published_at) where status = 'published';
create index search_content_vector_idx on search_index using ivfflat (content_vector vector_cosine_ops);
create index search_text_idx on search_index using gin (text_search);

-- Functions
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers
create trigger set_timestamp
before update on content
for each row
execute function update_updated_at();

create trigger set_translation_timestamp
before update on content_translations
for each row
execute function update_updated_at();

-- RLS Policies
alter table "public"."content" enable row level security;
alter table "public"."content_translations" enable row level security;
alter table "public"."categories" enable row level security;
alter table "public"."category_translations" enable row level security;

-- Read access for published content
create policy "Public read access for published content"
on "public"."content"
for select
using (status = 'published');

-- Full access for authenticated users with admin role
create policy "Admin full access"
on "public"."content"
for all
using (
  auth.role() = 'authenticated' and 
  auth.uid() in (
    select id from auth.users 
    where raw_user_meta_data->>'role' = 'admin'
  )
);
