use diesel::prelude::*;

use super::media::Media;

use crate::schema::translation;

#[derive(Queryable, Selectable, Associations)]
#[diesel(table_name = translation)]
#[diesel(belongs_to(Media))]
pub struct Translation {
    pub id:       uuid::Uuid,
    pub media_id: uuid::Uuid,
}
