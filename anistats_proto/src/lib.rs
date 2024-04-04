// @generated
pub mod anistats {
    #[cfg(feature = "anistats-list")]
    // @@protoc_insertion_point(attribute:anistats.list)
    pub mod list {
        include!("anistats.list.rs");
        // @@protoc_insertion_point(anistats.list)
    }
    #[cfg(feature = "anistats-media")]
    // @@protoc_insertion_point(attribute:anistats.media)
    pub mod media {
        include!("anistats.media.rs");
        // @@protoc_insertion_point(anistats.media)
    }
}
#[cfg(feature = "uuid")]
// @@protoc_insertion_point(attribute:uuid)
pub mod uuid {
    include!("uuid.rs");
    // @@protoc_insertion_point(uuid)
}