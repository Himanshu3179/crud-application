import authOption from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function isAuthenticated() {
  const session = await getServerSession(authOption);
  if (!session) {
    return false;
  }
  return true;
}

export async function getUser() {
  const session = await getServerSession(authOption);
  if (!session) {
    return null;
  }
  return session.user.name as string;
}
