import { createSignal, JSX } from "solid-js";
import { A, FormError, useParams, useRouteData } from "solid-start";
import { createServerAction$, redirect } from "solid-start/server";
import { db } from "~/db";
import { getUserId } from "~/db/session";
import { useUser } from "~/db/useUser";

export function routeData() {
  return useUser();
}

export default function Cats(): JSX.Element {
  const params = useParams();

  const user = useRouteData<typeof routeData>();

  const [deletingFact, { Form: DeleteForm }] = createServerAction$(
    async (form: FormData, { request }) => {
      const userId = await getUserId(request);

      if (!userId) {
        throw new FormError(`not allowed.`);
      }

      const hash = form.get("hash");

      if (typeof hash !== "string" || hash.length == 0) {
        throw new FormError(`Hash not submitted correctly.`);
      }
      try {
        await db.savedFacts.delete({
          where: { userId_hash: { hash, userId } },
        });
      } catch (err) {
        console.log({ err });
        throw new FormError(`Fact could not be deleted.`);
      }
      return redirect("/");
    },
    { invalidate: ["userData"] }
  );

  const [catIcon, setCatIcon] = createSignal<"😿" | "🙀">("😿");

  const selectedFact = () =>
    user()?.savedFacts.find((f) => f.hash === params.id);

  return (
    <div class="m-auto card w-1/3 bg-base-100 shadow-xl p-10">
      <div class="card-body">
        <h2 class="card-title">Cat Fact: #{params.id?.slice(0, 8)}</h2>
        <div class="mb-5">{selectedFact()?.fact}</div>
        <div class="text-gray-500">
          <div>Length: {selectedFact()?.fact.length}</div>
          <div>Saved on: {selectedFact()?.createdAt}</div>
        </div>
        <div>&nbsp;</div>
        <div class="card-actions justify-end">
          <DeleteForm>
            <input type="hidden" name="hash" value={params.id} />
            <button
              onMouseOver={() => setCatIcon("🙀")}
              onMouseOut={() => setCatIcon("😿")}
              disabled={deletingFact.pending}
              type="submit"
              class="btn btn-error"
            >
              Delete {catIcon()}
            </button>
          </DeleteForm>
          <A href="/" class="btn btn-primary">
            Back
          </A>
        </div>
      </div>
    </div>
  );
}
