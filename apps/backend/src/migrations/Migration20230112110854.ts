import { Migration } from '@mikro-orm/migrations';

export class Migration20230112110854 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `list_settings` (`id` varchar(36) not null, `allow_chunk_merge` tinyint(1) not null, `max_chunk_length` int not null, `max_chunk_join_length` int not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `series` (`id` varchar(36) not null, `anilist_id` json not null, `title` json not null, `cover_image` varchar(255) null, `duration` int not null, `episodes` int null, `description` varchar(255) null, `created_at` datetime not null, `synchronized_at` datetime null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `series_prequels` (`series_entity_1_id` varchar(36) not null, `series_entity_2_id` varchar(36) not null, primary key (`series_entity_1_id`, `series_entity_2_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `series_prequels` add index `series_prequels_series_entity_1_id_index`(`series_entity_1_id`);');
    this.addSql('alter table `series_prequels` add index `series_prequels_series_entity_2_id_index`(`series_entity_2_id`);');

    this.addSql('create table `user` (`id` varchar(36) not null, `name` varchar(255) not null, `anilist_id` json not null, `avatar_url` varchar(255) not null, `created_at` datetime not null, `synchronized_at` datetime null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `list` (`id` varchar(36) not null, `name` varchar(255) not null, `user_id` varchar(36) not null, `settings_id` varchar(36) not null, `created_at` datetime not null, `synchronized_at` datetime null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `list` add index `list_user_id_index`(`user_id`);');
    this.addSql('alter table `list` add unique `list_settings_id_unique`(`settings_id`);');

    this.addSql('create table `entry` (`id` varchar(36) not null, `list_id` varchar(36) not null, `series_id` varchar(36) not null, `data_id` varchar(36) not null, `state` enum(\'completed\', \'current\', \'dropped\', \'paused\', \'planning\', \'repeating\') not null, `progress` int not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `entry` add index `entry_list_id_index`(`list_id`);');
    this.addSql('alter table `entry` add index `entry_series_id_index`(`series_id`);');
    this.addSql('alter table `entry` add unique `entry_data_id_unique`(`data_id`);');

    this.addSql('create table `entry_data` (`id` varchar(36) not null, `entry_id` varchar(36) not null, `mult` int not null, `order` int not null, `start_at` int null, `split` int null, `split_sequel_entry` tinyint(1) not null default false, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `entry_data` add unique `entry_data_entry_id_unique`(`entry_id`);');

    this.addSql('alter table `series_prequels` add constraint `series_prequels_series_entity_1_id_foreign` foreign key (`series_entity_1_id`) references `series` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `series_prequels` add constraint `series_prequels_series_entity_2_id_foreign` foreign key (`series_entity_2_id`) references `series` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `list` add constraint `list_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;');
    this.addSql('alter table `list` add constraint `list_settings_id_foreign` foreign key (`settings_id`) references `list_settings` (`id`) on update cascade;');

    this.addSql('alter table `entry` add constraint `entry_list_id_foreign` foreign key (`list_id`) references `list` (`id`) on update cascade;');
    this.addSql('alter table `entry` add constraint `entry_series_id_foreign` foreign key (`series_id`) references `series` (`id`) on update cascade;');
    this.addSql('alter table `entry` add constraint `entry_data_id_foreign` foreign key (`data_id`) references `entry_data` (`id`) on update cascade;');

    this.addSql('alter table `entry_data` add constraint `entry_data_entry_id_foreign` foreign key (`entry_id`) references `entry` (`id`) on update cascade;');
  }

}
