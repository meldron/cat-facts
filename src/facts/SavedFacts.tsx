import { refetchRouteData } from "solid-start";
import { createServerAction$ } from "solid-start/server";
import { logout, SavedFact } from "~/db/session";
import { SavedFactsTable } from "./SavedFactsTable";

export interface SavedFactsProps {
  savedFacts?: SavedFact[];
  currentFactHash?: string;
}

export function SavedFacts(props: SavedFactsProps) {
  const [, { Form }] = createServerAction$((f: FormData, { request }) =>
    logout(request)
  );

  return (
    <div class="w-full bg-base-100 shadow-xl p-10">
      <h2 class="card-title mb-5">Saved Facts 😻</h2>
      <div class="card-actions justify-start mb-5">
        <Form>
          <button
            class="btn btn-primary mr-2"
            type="button"
            onClick={() => refetchRouteData("userData")}
          >
            Refresh
          </button>
          <button class="btn btn-warning" name="logout" type="submit">
            Logout
          </button>
        </Form>
      </div>
      <SavedFactsTable
        savedFacts={props.savedFacts}
        currentFactHash={props.currentFactHash}
      />
    </div>
  );
}
