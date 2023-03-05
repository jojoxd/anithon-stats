import { Migration } from '@mikro-orm/migrations';

export class Migration20230226152139 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `entry` add `anilist_id` json not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `entry` drop `anilist_id`;');
  }

}
