// @generated automatically by Diesel CLI.

diesel::table! {
    list (id) {
        id -> Uuid,
        name -> Varchar,
    }
}

diesel::table! {
    list_item (id) {
        id -> Uuid,
        list_id -> Uuid,
        media_id -> Uuid,
    }
}

diesel::table! {
    media (id) {
        id -> Uuid,
        anilist_id -> Int8,
    }
}

diesel::table! {
    translation (id) {
        id -> Uuid,
        media_id -> Nullable<Uuid>,
    }
}

diesel::joinable!(list_item -> list (list_id));
diesel::joinable!(list_item -> media (media_id));
diesel::joinable!(translation -> media (media_id));

diesel::allow_tables_to_appear_in_same_query!(
    list,
    list_item,
    media,
    translation,
);
