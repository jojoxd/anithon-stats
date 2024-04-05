use std::ffi::{c_char, CStr};
use std::sync::Arc;

use diesel::prelude::*;

use crate::data_access::connection::DbPool;
use crate::data_access::entity::media::Media;
use crate::schema::media;

#[derive(Debug)]
pub struct MediaRepository {
    pool: Arc<DbPool>,
}

impl MediaRepository {
    pub fn new(pool: Arc<DbPool>) -> Self {
        MediaRepository {
            pool: pool.clone(),
        }
    }

    #[tracing::instrument]
    pub fn get_by_id(&self, id: uuid::Uuid) -> anyhow::Result<Media> {
        let mut connection = self.pool.clone().get().unwrap();

        let media_instance = media::table
            .select(Media::as_select())
            .filter(media::id.eq(id))
            .first(&mut connection)?;

        Ok(media_instance)
    }

    #[tracing::instrument]
    pub fn get_by_anilist_id(&self, anilist_id: i64) -> anyhow::Result<Media> {
        let mut connection = self.pool.clone().get().unwrap();

        let media_instance = media::table
            .select(Media::as_select())
            .filter(media::anilist_id.eq(anilist_id))
            .first(&mut connection)?;

            Ok(media_instance)
    }
}

pub extern "C" fn get_media_by_id(mediaIdPtr: *const c_char) {
    let mediaId = unsafe { CStr::from_ptr(mediaIdPtr) };

    tracing::info!("Fetching media by using C ABI's");
}
