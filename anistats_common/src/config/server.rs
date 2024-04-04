use std::net::SocketAddr;
use std::path::PathBuf;
use std::fs::File;
use std::io::Read;

use clap_serde_derive::{clap::{self, arg}, ClapSerde};
use serde::Deserialize;
use super::Config;

#[derive(Debug, Deserialize, ClapSerde)]
pub struct ServerConfig {
    /// The host to start the grpc server on
    #[arg(
        short = 'H',
        long = "server-host",
        //default_value = "127.0.0.1"
    )]
    pub host: Option<String>,

    /// The port to start the grpc server on
    #[arg(
        short = 'P',
        long = "server-port",
        //default_value = "6969"
    )]
    pub port: Option<usize>,
}

impl ServerConfig {
    pub fn parse_config(path: PathBuf) -> anyhow::Result<Self> {
        if let Ok(mut file) = File::open(path) {
            let mut contents = String::new();
            if let Ok(_) = file.read_to_string(&mut contents) {
                match toml::from_str::<Config>(contents.as_str()) {
                    Ok(config) => return Ok(config.server.into()),
                    Err(err)   => panic!("{}", err),
                }
            }
        }

        Ok(
            ServerConfig::default()
        )
    }

    pub fn socket_addr(&self) -> anyhow::Result<SocketAddr> {
        let socket_addr = format!("{}:{}", &self.host.clone().unwrap(), &self.port.unwrap()).parse::<SocketAddr>()?;

        Ok(socket_addr)
    }
}
