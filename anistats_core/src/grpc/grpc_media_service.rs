use proto::anistats::media::{get_media_request::Identifier, media_service_server::{self as server, MediaServiceServer}, GetMediaRequest, Media as MediaProto, SearchMediaRequest, SearchMediaResponse};
use tonic::{Request, Response, Status};

use crate::data_access::repository::media_repository::MediaRepository;

#[derive(Debug)]
pub struct GrpcMediaService {
    media_repository: MediaRepository,
}

impl GrpcMediaService {
    pub fn init(
        media_repository: MediaRepository,
    ) -> MediaServiceServer<GrpcMediaService> {
        MediaServiceServer::new(
            GrpcMediaService {
                media_repository,
            }
        )
    }

    pub fn reflection() -> &'static [u8] {
        proto::anistats::media::FILE_DESCRIPTOR_SET
    }
}

#[tonic::async_trait]
impl server::MediaService for GrpcMediaService {
    #[tracing::instrument(name = "get_media", level = "INFO")]
    async fn get_media(
        &self,
        request: Request<GetMediaRequest>
    ) -> Result<Response<MediaProto>, Status> {
        if let Some(ident) = request.into_inner().identifier {
            let media = match ident {
                Identifier::Id(uuid) =>
                    self.media_repository
                        .get_by_id(uuid.into())
                        .or(Err(Status::not_found("Media not found"))),

                Identifier::AnilistId(anilist_id) =>
                    self.media_repository
                        .get_by_anilist_id(anilist_id)
                        .or(Err(Status::not_found("Media not found"))),
            };

            if let Ok(media_inner) = media {
                return Ok(
                    Response::new(
                        MediaProto {
                            id: Some(media_inner.id.into()),
                        }
                    )
                );
            }

            // @TODO: Fetch from anilist
        }

        Err(Status::not_found("Media not found"))

    }

    #[tracing::instrument]
    async fn search_media(
        &self,
        request: Request<SearchMediaRequest>
    ) -> Result<Response<SearchMediaResponse>, Status> {
        todo!();
    }
}
