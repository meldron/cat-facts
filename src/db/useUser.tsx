import { PrismaClient } from "@prisma/client";
import { createServerData$, redirect } from "solid-start/server";
import { db } from ".";
import { getUser } from "./session";

export const useUser = () =>
  createServerData$(
    async (_, { request }) => {
      const user = await getUser(db, request);

      if (!user) {
        throw redirect("/login");
      }
      return user;
    },
    { key: "userData" }
  );
