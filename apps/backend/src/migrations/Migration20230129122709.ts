import { Migration } from '@mikro-orm/migrations';

export class Migration20230129122709 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` modify `anilist_token` text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` modify `anilist_token` text not null;');
  }

}
