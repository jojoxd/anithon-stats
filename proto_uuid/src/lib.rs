use derive_more::{AsMut, AsRef, Constructor, Deref, DerefMut, Display, From, FromStr, Into};
use prost::{
    bytes::{Buf, BufMut},
    encoding::{skip_field, string, DecodeContext, WireType},
    DecodeError, Message,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// NewType wrapper around [`uuid::Uuid`] with implementation of [`prost::Message`] for it.
/// It uses [`prost::encoding::string`] inside.
//TODO: put serde derive traits under feature
#[derive(
    Default,
    Debug,
    Clone,
    Copy,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd,
    Serialize,
    Deserialize,
    AsMut,
    AsRef,
    Constructor,
    Deref,
    DerefMut,
    Display,
    From,
    FromStr,
    Into,
)]
pub struct ProtoUuid(Uuid);

impl Message for ProtoUuid {
    fn encode_raw<B>(&self, buf: &mut B)
    where
        B: BufMut,
    {
        string::encode(1, &self.0.to_string(), buf)
    }

    fn merge_field<B>(
        &mut self,
        tag: u32,
        wire_type: WireType,
        buf: &mut B,
        ctx: DecodeContext,
    ) -> Result<(), DecodeError>
    where
        B: Buf,
    {
        if tag == 1 {
            let mut uuid_string = self.0.to_string();
            let merge_result = string::merge(wire_type, &mut uuid_string, buf, ctx);
            self.0 = Uuid::parse_str(&uuid_string)
                .map_err(|error| DecodeError::new(error.to_string()))?;
            merge_result
        } else {
            skip_field(wire_type, tag, buf, ctx)
        }
    }

    fn encoded_len(&self) -> usize {
        string::encoded_len(1, &self.0.to_string())
    }

    /// Clear the message, resetting inner [`uuid::Uuid`] to [`Uuid::nil`].
    fn clear(&mut self) {
        self.0 = Uuid::nil();
    }
}

#[cfg(test)]
mod tests {
    use uuid::Uuid;

    use crate::ProtoUuid;

    #[test]
    fn test_derive_more() {
        let prost_uuid = ProtoUuid::from(Uuid::nil());
        let uuid = Uuid::from(prost_uuid);
        assert_eq!(format!("{}", uuid), format!("{}", prost_uuid));
        let new_prost_uuid = ProtoUuid::new(uuid);
        let mut mut_prost_uuid = new_prost_uuid;
        let another_prost_uuid = new_prost_uuid;
        function_expect_uuid(
            new_prost_uuid.as_ref(),
            mut_prost_uuid.as_mut(),
            *another_prost_uuid,
        );
    }

    fn function_expect_uuid(_uuid_ref: &Uuid, _uuid_mut_ref: &mut Uuid, _uuid: Uuid) {}
}
