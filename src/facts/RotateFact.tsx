import { createSignal } from "solid-js";
import { refetchRouteData } from "solid-start";

export function RotateFact() {
  const [rotateFact, setRotateFact] = createSignal<"↺" | "⟲">("↺");

  return (
    <button
      onMouseOver={() => setRotateFact("⟲")}
      onMouseOut={() => setRotateFact("↺")}
      class="btn btn-primary mr-2"
      type="button"
      onClick={() => refetchRouteData(["randomFact"])}
    >
      New Fact {rotateFact()}
    </button>
  );
}
