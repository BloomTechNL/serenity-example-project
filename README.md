# Serenity Example Project

An example project showing how to write acceptance tests with
[Serenity/JS](https://serenity-js.org/) (the Screenplay Pattern) combined
with [`serenity-scenario-context`](https://www.npmjs.com/package/serenity-scenario-context),
an Ability that gives actors a type-safe, qualifier-aware place to remember
scenario state.

## Layout

- [`ticketing-system/`](ticketing-system) — a tiny in-memory "system under
  test": a support-desk API for registering agents, raising tickets,
  resolving them, and searching by subject.
- [`acceptance-tests/`](acceptance-tests) — the acceptance tests themselves,
  organised the Screenplay way:
  - [`interactions/`](acceptance-tests/interactions) — things an actor can
    *do* (register, log in, raise a ticket, resolve it, change its subject).
  - [`questions/`](acceptance-tests/questions) — things an actor can *ask*
    about the system (the ticket in the spotlight, how many tickets match a
    search).
  - [`tasks/`](acceptance-tests/tasks) — higher-level tasks composed from
    interactions (setting up an account).
  - [`cast.ts`](acceptance-tests/cast.ts) — wires up each actor with the
    abilities to use the support-desk API and a shared `ScenarioContext`.
  - `*.spec.ts` — the scenarios themselves.

## Why `serenity-scenario-context`?

Once a ticket is raised, later interactions and questions (resolving it,
changing its subject, reading it back) need to know *which* ticket to act
on — without every scenario having to pass an id around by hand.

`ScenarioContext` solves this by keeping the most recently added object of
a given type "in the spotlight", so `resolveTicket()` with no arguments
naturally acts on the ticket just raised. When a scenario juggles several
tickets at once, a `label` qualifier tells them apart:

```ts
raiseTicket({ label: 'billing' });
raiseTicket({ label: 'login' });

resolveTicket('billing');
```

See [`acceptance-tests/ticket-resolving.spec.ts`](acceptance-tests/ticket-resolving.spec.ts)
and [`acceptance-tests/ticket-subject.spec.ts`](acceptance-tests/ticket-subject.spec.ts)
for the full scenarios, and the [package README](https://www.npmjs.com/package/serenity-scenario-context)
for more on the API.

## Running the tests

```bash
npm install
npm test
```

A pre-commit hook (via Husky) runs the test suite before every commit.
