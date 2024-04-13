// @TODO: This command should connect the back-end to the front-end using FFI

use anyhow::Ok;

mod flutter {
    #[link(name = "anistats_ui", kind = "dylib")]
    #[link(name = "app", kind = "dylib")]
    #[link(name = "flutter_linux_gtk", kind = "dylib")]
    extern "C" {
        pub fn bootstrap(argc: libc::c_int, argv: *mut libc::c_char) -> libc::c_int;
    }
}

pub fn ui_command() -> anyhow::Result<i32> {
    let mut argv: *mut libc::c_char = std::ptr::null_mut();

    tracing::info!("Calling into flutter");

    if cfg!(feature = "ui") {
        let out: i32 = unsafe {
            flutter::bootstrap(0, argv)
        };

        return Ok(out);
    }

    Err(anyhow::anyhow!("UI Disabled"))
}
