import { Migration } from '@mikro-orm/migrations';

export class Migration20230112121759 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `series` modify `description` longtext;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `series` modify `description` varchar(255);');
  }

}
