use anistats_common::config::{database::DatabaseConfig, server::ServerConfig};
use clap::Subcommand;

use clap_serde_derive::{
    clap::{self},
    ClapSerde,
};

#[derive(Subcommand)]
pub enum Command {
    Serve {
        #[clap(flatten)]
        server: <ServerConfig as ClapSerde>::Opt,

        #[clap(flatten)]
        database: <DatabaseConfig as ClapSerde>::Opt,
    },

    Migrate {
        #[clap(flatten)]
        database: <DatabaseConfig as ClapSerde>::Opt,
    },
}
