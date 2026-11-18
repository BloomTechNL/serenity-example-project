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
    interactions (signing up: registering and logging in).
  - [`processes/`](acceptance-tests/processes) — processes performed by
    several actors, each playing a role (a customer and an agent handing
    over a ticket).
  - [`cast.ts`](acceptance-tests/cast.ts) — wires up each actor with the
    abilities to use the support-desk API and a shared `ScenarioContext`.
  - [`serenity.config.ts`](acceptance-tests/serenity.config.ts) — configures
    Serenity/JS for Mocha and engages a fresh cast before every test, so
    specs just call `actorCalled('Name')`.
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

## Given, When, Then with `test-phase`

Every scenario is split into phases with
[`test-phase`](https://github.com/BloomTechNL/test-phase):

```ts
await Given(() => chidi.attemptsTo(signUp(), raiseTicket({ label: 'billing' })));
await When(() => chidi.attemptsTo(resolveTicket('billing')));
await Then(() => chidi.attemptsTo(Ensure.that(ticket('billing'), property('status', equals('resolved')))));
```

The phase is used in two places:

- **At runtime** — [`UseSupportDeskApi`](acceptance-tests/use-support-desk-api.ts)
  checks `inThenPhase()` and refuses `POST` requests there, so a `Then`
  can only observe the system, never change it. The phase is reset after
  each test in [`serenity.config.ts`](acceptance-tests/serenity.config.ts).
- **At lint time** — [`eslint.config.mjs`](eslint.config.mjs) enables the
  `test-phase` ESLint rules: no `Ensure` inside `Given`/`When`, and at most
  one `Given`, `When` and `Then` per test.

## Several actors with `serenity-process`

Some scenarios need more than one actor: a customer raises a ticket and a
support agent resolves it. [`serenity-process`](https://github.com/BloomTechNL/serenity-process)
offers a `Process`: like a `Task`, but each step is played by a *role*. The
actors are bound only when the process runs, so the same process can be
reused with the roles swapped:

```ts
const ticketHandover = () =>
    Process.where('#customer raises a ticket that #agent resolves',
        step('customer', raiseTicket()),
        step('agent', resolveTicket()),
    );

await When(ticketHandover().with({ customer: chidi, agent: priya }));
```

Because every actor in the cast shares the same `ScenarioContext`, the
agent's `resolveTicket()` finds the ticket the customer just raised. A
process can also nest another one with `subprocess(child, { childRole: 'parentRole' })`.
See [`acceptance-tests/processes/`](acceptance-tests/processes) and
[`acceptance-tests/ticket-handover.spec.ts`](acceptance-tests/ticket-handover.spec.ts).

## Running the tests

```bash
npm install
npm run lint
npm test
```

A pre-commit hook (via Husky) runs the type check, the linter and the test
suite before every commit.
