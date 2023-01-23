import { Show } from "solid-js";

export interface ShowFactProps {
  factMessage?: string;
  alreadySaved: boolean;
}

export function ShowFact(props: ShowFactProps) {
  return (
    <>
      <h2 class="card-title">Your Random Cat Fact:</h2>
      <Show when={props.factMessage} keyed>
        {(fact) => (
          <div>
            {props.alreadySaved ? "😻 " : ""}
            {fact}
          </div>
        )}
      </Show>
    </>
  );
}
