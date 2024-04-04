mod data_access;
mod grpc;
mod models;
mod schema;

use std::sync::Arc;

use tonic::transport::Server;
use anistats_common::config::{server::ServerConfig, database::DatabaseConfig};

use crate::{data_access::{connection::{create_db_pool, DbPool}, repository::media_repository::MediaRepository}, grpc::grpc_media_service::GrpcMediaService};

pub async fn serve(server_config: ServerConfig, database_config: DatabaseConfig) -> anyhow::Result<()> {
    let reflection_service = tonic_reflection::server::Builder::configure()
        .register_encoded_file_descriptor_set(proto::uuid::FILE_DESCRIPTOR_SET)
        .register_encoded_file_descriptor_set(GrpcMediaService::reflection())
        .build()
        .unwrap();

    let db_pool: Arc<DbPool> = Arc::new(create_db_pool(Arc::new(database_config))?);
    let media_repository = MediaRepository::new(db_pool);

    tracing::info!("Serving on {}", server_config.socket_addr()?);

    Server::builder()
        .trace_fn(|_| tracing::info_span!("grpc"))
        .add_service(reflection_service)
        .add_service(GrpcMediaService::init(media_repository))
        .serve(server_config.socket_addr()?)
        .await?;

    Ok(())
}

pub fn migrate(database_config: DatabaseConfig) -> anyhow::Result<()> {
    let db_pool: DbPool = create_db_pool(Arc::new(database_config))?;
    let mut connection = match db_pool.get() {
        Ok(conn) => conn,
        Err(err) => panic!("{:?}", err),
    };

    match data_access::migrations::migrate(&mut connection) {
        Ok(_) => Ok(()),
        Err(err) => panic!("{:?}", err),
    }
}
