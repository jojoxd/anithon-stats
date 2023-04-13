import { Migration } from '@mikro-orm/migrations';

export class Migration20230408074734 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `entry` add `custom_sequel_id` varchar(36) null;');
    this.addSql('alter table `entry` add constraint `entry_custom_sequel_id_foreign` foreign key (`custom_sequel_id`) references `entry` (`id`) on update cascade on delete set null;');
    this.addSql('alter table `entry` add unique `entry_custom_sequel_id_unique`(`custom_sequel_id`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `entry` drop foreign key `entry_custom_sequel_id_foreign`;');

    this.addSql('alter table `entry` drop index `entry_custom_sequel_id_unique`;');
    this.addSql('alter table `entry` drop `custom_sequel_id`;');
  }

}
