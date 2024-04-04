use crate::data_access::entity::media::Media;

pub struct List {
    pub id:    uuid::Uuid,
    pub name:  String,

    pub items: Vec<ListItem>,
}

pub struct ListItem {
    pub id:    uuid::Uuid,
    pub list:  List,
    pub media: Media,
}
