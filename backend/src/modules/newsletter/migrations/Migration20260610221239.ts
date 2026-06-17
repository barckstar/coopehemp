import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260610221239 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "newsletter_campaign" ("id" text not null, "status" text not null default 'draft', "sent_at" timestamptz null, "recipient_count" integer not null default 0, "translations" jsonb not null default '[]', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "newsletter_campaign_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_newsletter_campaign_deleted_at" ON "newsletter_campaign" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "newsletter_subscriber" ("id" text not null, "email" text not null, "locale" text not null default 'es', "is_active" boolean not null default true, "unsubscribe_token" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "newsletter_subscriber_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_newsletter_subscriber_deleted_at" ON "newsletter_subscriber" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "newsletter_campaign" cascade;`);

    this.addSql(`drop table if exists "newsletter_subscriber" cascade;`);
  }

}
