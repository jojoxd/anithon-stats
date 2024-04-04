use diesel::prelude::*;

use crate::schema::media;

#[derive(Debug)]
#[derive(Queryable, QueryableByName, Selectable, Identifiable)]
#[diesel(table_name = media)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Media {
    pub id:           uuid::Uuid,
    pub anilist_id:   i64,
}
