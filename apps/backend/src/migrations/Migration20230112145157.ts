import { Migration } from '@mikro-orm/migrations';

export class Migration20230112145157 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `entry_data` drop foreign key `entry_data_entry_id_foreign`;');

    this.addSql('alter table `entry_data` drop index `entry_data_entry_id_unique`;');
    this.addSql('alter table `entry_data` drop `entry_id`;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `entry_data` add `entry_id` varchar(36) not null;');
    this.addSql('alter table `entry_data` add constraint `entry_data_entry_id_foreign` foreign key (`entry_id`) references `entry` (`id`) on update cascade;');
    this.addSql('alter table `entry_data` add unique `entry_data_entry_id_unique`(`entry_id`);');
  }

}
