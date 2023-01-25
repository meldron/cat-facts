import { createHash } from "crypto";
import { createSignal, Show } from "solid-js";
import { FormError } from "solid-start";
import { createServerAction$ } from "solid-start/server";
import { db } from "~/db";
import { getUserId } from "~/db/session";

export interface SaveFactsFormProps {
  alreadySaved: boolean;
  factMessage?: string;
}

export function SaveFactsForm(props: SaveFactsFormProps) {
  const [savingFact, { Form: SaveForm }] = createServerAction$(
    async (form: FormData, { request }) => {
      const userId = await getUserId(request);

      if (typeof userId !== "string") {
        return new FormError(`not allowed.`);
      }

      const fact = form.get("fact");

      if (typeof fact !== "string" || fact.length == 0) {
        throw new FormError(`Fact not submitted correctly.`);
      }

      const hash = createHash("sha256").update(fact).digest("hex");

      try {
        await db.savedFacts.create({ data: { fact, hash, userId } });
      } catch (err) {
        throw new FormError(`Fact could not be saved.`);
      }
    },
    { invalidate: ["userData"] }
  );

  const [catIcon, setCatIcon] = createSignal<"😸" | "😻">("😸");

  return (
    <Show when={props.factMessage} keyed>
      {(fact) => (
        <>
          <SaveForm>
            <input type="hidden" name="fact" value={fact} />
            <button
              onMouseOver={() => setCatIcon("😻")}
              onMouseOut={() => setCatIcon("😸")}
              disabled={savingFact.pending || props.alreadySaved}
              class="btn btn-success mr-2"
              type="submit"
            >
              Save Fact {catIcon()}
            </button>
          </SaveForm>
          <Show when={savingFact.error}>
            <div>{savingFact.error}</div>
          </Show>
        </>
      )}
    </Show>
  );
}
