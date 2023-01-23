import { PrismaClient, SavedFacts, User } from "@prisma/client";
import * as sodium from "libsodium-wrappers";
import { redirect } from "solid-start/server";
import { createCookieSessionStorage } from "solid-start/session";
import { db } from ".";
type LoginForm = {
  username: string;
  password: string;
};

export function hashPassword(password: string): string {
  return sodium.crypto_pwhash_str(
    password,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE
  );
}

export function verifyPassword(
  hashedPassword: string,
  password: string
): boolean {
  return sodium.crypto_pwhash_str_verify(hashedPassword, password);
}

export async function register({ username, password }: LoginForm) {
  const passwordHash = hashPassword(password);

  return db.user.create({
    data: { username, password: passwordHash },
  });
}

export async function login({ username, password }: LoginForm) {
  const user = await db.user.findUnique({ where: { username } });
  if (!user) return null;
  const isCorrectPassword = verifyPassword(user.password, password);
  if (!isCorrectPassword) return null;
  return user;
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // secure doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: true,
    secrets: ["DoNFCS9hq62E74Rqu1Tgd"],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export interface SavedFact {
  createdAt: string;
  fact: string;
  hash: string;
}

export async function getUser(db: PrismaClient, request: Request) {
  const userId = await getUserId(request);

  if (typeof userId !== "string") {
    return null;
  }

  let user: User;

  try {
    user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  } catch (err) {
    return null;
  }

  let savedFacts: SavedFacts[];

  try {
    savedFacts = await db.savedFacts.findMany({ where: { userId: user.id } });
  } catch {
    savedFacts = [];
  }

  const savedFactsStrings = savedFacts.map(({ createdAt, fact, hash }) => ({
    createdAt: new Date(createdAt).toISOString(),
    fact,
    hash,
  }));

  return { user, savedFacts: savedFactsStrings };
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const del = await storage.destroySession(session);

  return redirect("/login", {
    headers: {
      "Set-Cookie": del,
    },
  });
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
