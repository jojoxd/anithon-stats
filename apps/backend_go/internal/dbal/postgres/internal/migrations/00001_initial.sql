-- +goose up
CREATE TABLE users (
	id uuid DEFAULT uuidv7() PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	anilist_id VARCHAR(255) NOT NULL,
	avatar_url TEXT,
	created_at timestamptz NOT NULL,
	-- todo: updated_at
	synchronized_at timestamptz NULL DEFAULT NULL
);

CREATE TABLE list_settings (
	id uuid DEFAULT uuidv7() PRIMARY KEY,
	stack_size INT NOT NULL,
	allow_chunk_merge BOOLEAN NOT NULL,
	max_chunk_length INT NOT NULL,
	max_chunk_join_length INT NOT NULL
);

CREATE TABLE lists (
	id uuid DEFAULT uuidv7() PRIMARY KEY,
	settings_id uuid,
	name VARCHAR(255) NOT NULL,
	user_id uuid REFERENCES users(id) NOT NULL,
	created_at timestamptz NOT NULL,
	-- todo: updated_at
	synchronized_at timestamptz NULL DEFAULT NULL,

	FOREIGN KEY (settings_id)
		REFERENCES list_settings(id)
   		ON DELETE RESTRICT
);

CREATE TABLE translations (
	id uuid DEFAULT uuidv7() PRIMARY KEY NOT NULL
);

CREATE TABLE translations_translation (
	id uuid NOT NULL,
	locale VARCHAR(255) NOT NULL,
	translation TEXT NOT NULL,

	UNIQUE (id, locale),

	FOREIGN KEY(id)
		REFERENCES translations(id)
		ON DELETE CASCADE
);

CREATE TABLE series (
	id uuid DEFAULT uuidv7() PRIMARY KEY,
	anilist_id TEXT NOT NULL,
	title_translation_id uuid NOT NULL,
	cover_image_url TEXT NULL DEFAULT NULL,
	duration INT NOT NULL,
	episodes INT NULL DEFAULT NULL,
	description TEXT NULL DEFAULT NULL,
	-- todo: join table for prequels/sequels
	created_at timestamptz NOT NULL,
	-- todo: updated_at
	synchronized_at timestamptz NULL DEFAULT NULL,

	FOREIGN KEY (title_translation_id)
		REFERENCES translations(id)
);

CREATE TABLE entry_data (
	id uuid DEFAULT uuidv7() PRIMARY KEY,
	mult DECIMAL(2,1) NOT NULL DEFAULT 1.0,
	"order" INT NULL DEFAULT NULL,
	start_at INT NULL DEFAULT NULL,
	split INT NULL DEFAULT NULL,
	split_sequel_entry BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE entries (
	id uuid DEFAULT uuidv7() PRIMARY KEY,
	list_id uuid NOT NULL,
	series_id uuid NOT NULL,
	data_id uuid NOT NULL,
	custom_sequel_entry_id uuid NULL DEFAULT NULL,
	anilist_id VARCHAR(255) NOT NULL,
	state VARCHAR(255) NOT NULL, -- enum?
	progress INT DEFAULT 0 NOT NULL,

	FOREIGN KEY (list_id)
		REFERENCES lists(id)
		ON DELETE RESTRICT,

	FOREIGN KEY (series_id)
		REFERENCES series(id)
		ON DELETE RESTRICT,

	FOREIGN KEY (data_id)
		REFERENCES entry_data(id)
		ON DELETE RESTRICT,

	FOREIGN KEY (custom_sequel_entry_id)
		REFERENCES entries(id)
);

-- +goose down
DROP TABLE entries;
DROP TABLE entry_data;
DROP TABLE series;
DROP TABLE lists;
DROP TABLE list_settings;
DROP TABLE users;
