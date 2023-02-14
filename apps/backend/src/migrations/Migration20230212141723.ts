import { Migration } from '@mikro-orm/migrations';

export class Migration20230212141723 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `list_settings` add `stack_size` int not null;');
	this.addSql('update `list_settings` set `stack_size` = 3');
  }

  async down(): Promise<void> {
    this.addSql('alter table `list_settings` drop `stack_size`;');
  }

}
