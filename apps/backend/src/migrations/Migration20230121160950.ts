import { Migration } from '@mikro-orm/migrations';

export class Migration20230121160950 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` add `anilist_token` text not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` drop `anilist_token`;');
  }

}
