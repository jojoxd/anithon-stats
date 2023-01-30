export function cookieJwtExtractor(cookieName: string)
{
	return (req?: Express.Request) => {
		// @ts-ignore TS2339 req.cookies is actually an available property
		return req?.cookies?.[cookieName] ?? null;
	}
}