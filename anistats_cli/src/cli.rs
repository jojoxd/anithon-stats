use std::path::PathBuf;

use clap::Parser;

use crate::command::Command;

#[derive(Parser)]
#[command(version, about, long_about = None)]
#[clap(disable_help_flag = true)]
pub struct Cli {
    /// Path to the configuration file
    #[arg(
        short,
        long,
        global = true,
        default_value = "config.toml"
    )]
    pub config: PathBuf,

    #[clap(
        long,
        action = clap::ArgAction::HelpLong,
        global = true
    )]
    pub help: Option<bool>,

    #[arg(
        short = 'v',
        action = clap::ArgAction::Count,
        help = "Verbosity level (none = warn, 3+ = trace)",
        global = true,
        default_value_t = 0
    )]
    pub verbose: u8,

    #[command(subcommand)]
    pub command: Option<Command>,
}

impl Cli {
    pub fn tracing_level(&self) -> tracing::Level {
        match self.verbose {
            0 => tracing::Level::WARN,
            1 => tracing::Level::INFO,
            2 => tracing::Level::DEBUG,
            _ => tracing::Level::TRACE,
        }
    }
}
