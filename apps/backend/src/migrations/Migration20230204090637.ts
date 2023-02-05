import { Migration } from '@mikro-orm/migrations';

export class Migration20230204090637 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `entry_data` modify `order` json null, modify `start_at` json, modify `split` json, modify `split_sequel_entry` tinyint(1) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `entry_data` modify `order` int not null, modify `start_at` int, modify `split` int, modify `split_sequel_entry` tinyint(1) not null default false;');
  }

}
