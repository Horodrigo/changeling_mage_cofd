import { headers } from "next/headers";
import { Workspace } from "./workspace";

export const dynamic = "force-dynamic";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email") ?? "usuário do workspace";
  const encodedName = requestHeaders.get("oai-authenticated-user-full-name");
  const displayName =
    encodedName && requestHeaders.get("oai-authenticated-user-full-name-encoding") === "percent-encoded-utf-8"
      ? decodeURIComponent(encodedName)
      : email;

  return <Workspace displayName={displayName} userKey={email.toLowerCase()} />;
}
