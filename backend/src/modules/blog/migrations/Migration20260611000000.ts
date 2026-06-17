import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260611000000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "blog_post" add column if not exists "gallery" jsonb not null default '[]';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "blog_post" drop column if exists "gallery";`);
  }
}
