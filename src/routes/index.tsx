import { createMemo, createSignal } from "solid-js";
import { useRouteData } from "solid-start";
import { RotateFact } from "~/facts/RotateFact";
import { SavedFacts } from "~/facts/SavedFacts";
import { SaveFactsForm } from "~/facts/SaveFactsForm";
import { ShowFact } from "~/facts/ShowFact";
import { useCatFac } from "~/facts/useCatFact";
import { useUser } from "../db/useUser";

export function routeData() {
  return useUser();
}

export function getFact() {
  return useCatFac();
}

export default function Home() {
  const [alreadySaved, setAlreadySaved] = createSignal(false);

  const user = useRouteData<typeof routeData>();
  const catFact = getFact();

  createMemo(() => {
    const savedFacts = user()?.savedFacts;
    const fact = catFact();

    if (!savedFacts || !fact) {
      setAlreadySaved(false);
      return;
    }

    const found = savedFacts.some((f) => f.hash === fact.hash);
    setAlreadySaved(found);
  });

  return (
    <main class="w-full p-4 space-y-2 grid md:grid-cols-2 gap-4">
      <div class="w-full self-start bg-base-100 shadow-xl p-10">
        <h1 class="font-bold text-3xl my-5">Hello {user()?.user.username}</h1>
        <ShowFact
          alreadySaved={alreadySaved()}
          factMessage={catFact()?.message}
        />
        <div class="mb-5">&nbsp</div>
        <div class="card-actions justify-start">
          <RotateFact />
          <SaveFactsForm
            alreadySaved={alreadySaved()}
            factMessage={catFact()?.message}
          />
        </div>
      </div>
      <SavedFacts
        savedFacts={user()?.savedFacts}
        currentFactHash={catFact()?.hash}
      />
    </main>
  );
}
