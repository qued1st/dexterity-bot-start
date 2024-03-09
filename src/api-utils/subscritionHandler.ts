import { Manifest, Trader } from "@hxronetwork/dexterity-ts";
import { PublicKey } from "@solana/web3.js";
import { accountPositioningHandler } from "./accountPositioningHandler";

export const handleNewSubscription = async (
  trader: Trader,
  manifest: Manifest,
  newTrg: string | null,
  AppState: Map<string, any>
) => {
  if (newTrg == null) {
    return new Response(JSON.stringify({ error: "No trg was passed" }), {
      status: 500,
    });
  }

  const copiedTrader = new Trader(manifest, new PublicKey(newTrg), true);
  AppState.set("copiedTrader", copiedTrader);

  await newAcccountSubscriptionHandler(newTrg)

  return new Response(
    JSON.stringify({
      ok: "Successfully set new Trader to Copy",
      newTrg,
    }),
    { status: 200 }
  );
};

export const handleCancelSubscription = async (
  AppState: Map<string, any>
) => {
  AppState.delete("copiedTrader");
  return new Response(
    JSON.stringify({
      ok: "Successfully canceled trader subscription",
    }),
    { status: 200 }
  );

};

const server = Bun.serve({
  async fetch(req, server) {
    const url = new URL(req.url);
    const { pathname, searchParams } = url;

    let response: Response | undefined = new Response(
      JSON.stringify({ status: 200 })
    );

    switch (pathname) {
      case "/process-trade":
        break;
      case "/new-subscription":
        response = await handleNewSubscription(trader, manifest, searchParams.get("trg"), AppState)
        break;
      case "/cancel-subscription":
        response = await handleCancelSubscription(AppState)
        break;
      default:
        break;
    }

    if (!response) return new Response(JSON.stringify({ status: 200 }));
    return response;
  },
});
