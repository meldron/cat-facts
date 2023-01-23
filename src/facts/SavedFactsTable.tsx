import { For } from "solid-js";
import { A } from "solid-start";
import { SavedFact } from "~/db/session";

export interface SavedFactsTableProps {
  savedFacts?: SavedFact[];
  currentFactHash?: string;
}

export function SavedFactsTable(props: SavedFactsTableProps) {
  return (
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Id</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.savedFacts}>
            {(fact, i) => (
              <tr class={props.currentFactHash === fact.hash ? "active" : ""}>
                <td>{i}</td>
                <td>
                  <A
                    class="text-blue-500 visited:text-blue-900"
                    href={`/cat-fact/${fact.hash}`}
                  >
                    {fact.hash.slice(0, 8)}
                  </A>
                </td>
                <td class="cursor-help">
                  <span title={fact.fact}>{fact.fact.slice(0, 8)}...</span>
                </td>
                <td>{fact.createdAt}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}
