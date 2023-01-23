import { Resource } from "solid-js";
import { createServerData$ } from "solid-start/server";

import { createHash } from "crypto";

export interface CatFact {
  type: "fact";
  hash: string;
  message: string;
}

export interface CatFactNinjaResponse {
  fact: string;
  length: number;
}

export type CatFactResponse = CatFact | null;

export const useCatFac: () => Resource<CatFactResponse | undefined> = () =>
  createServerData$(
    async (_, { request }) => {
      let response: Response;

      try {
        response = await fetch("https://catfact.ninja/fact", {
          headers: {
            accept: "application/json",
          },
          method: "GET",
          mode: "cors",
          credentials: "include",
        });
      } catch (error: any) {
        return null;
      }

      if (!response.ok) {
        return null;
      }

      const parsed = (await response.json()) as CatFactNinjaResponse;

      const hash = createHash("sha256").update(parsed.fact).digest("hex");

      return { type: "fact", message: parsed.fact, hash };
    },
    { key: "randomFact" }
  );
