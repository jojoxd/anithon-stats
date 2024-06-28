// use libc::CString;

pub extern "C" fn ffi_test_get_media() {
    // CString::from_str("Hello, FFI")
    println!("Hello From Rust");
}
