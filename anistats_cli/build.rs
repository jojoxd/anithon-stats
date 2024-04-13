pub fn main() {
    println!(r"cargo:rustc-link-search=anistats_app/interface/build/linux/x64/release/bundle/lib");
    println!(r"cargo:rustc-link-lib=dylib=anistats_ui");
    println!(r"cargo:rustc-link-arg=-Wl,-rpath,$ORIGIN/lib,-zorigin")
}
