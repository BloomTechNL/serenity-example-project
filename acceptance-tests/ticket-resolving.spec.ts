import { Actor, actorCalled } from '@serenity-js/core';
import { Ensure, equals, property } from '@serenity-js/assertions';
import { Given, Then, When } from 'test-phase';

import { raiseTicket } from './interactions/raise-ticket';
import { resolveTicket } from './interactions/resolve-ticket';
import { ticket } from './questions/ticket';
import { signUp } from './tasks/sign-up';

describe('A support agent using the scenario context', () => {
    let chidi: Actor;

    beforeEach(() => {
        chidi = actorCalled('Chidi');
    });

    it('raises a ticket that starts out open', async () => {
        await Given(() => chidi.attemptsTo(
            signUp(),
        ));

        await When(() => chidi.attemptsTo(
            raiseTicket(),
        ));

        await Then(() => chidi.attemptsTo(
            Ensure.that(ticket().status, equals('open')),
        ));
    });

    it('resolves a ticket by label, even when a later one is in the spotlight', async () => {
        await Given(() => chidi.attemptsTo(
            signUp(),

            raiseTicket({ label: 'billing' }),
            raiseTicket({ label: 'login' }),
        ));

        await When(() => chidi.attemptsTo(
            resolveTicket('billing'),
        ));

        await Then(() => chidi.attemptsTo(
            Ensure.that(ticket('billing'), property('status', equals('resolved'))),
            Ensure.that(ticket('login'), property('status', equals('open'))),
        ));
    });

    it('resolves a ticket by label, leaving an earlier one untouched', async () => {
        await Given(() => chidi.attemptsTo(
            signUp(),

            raiseTicket({ label: 'first-ticket' }),
            raiseTicket({}),
        ));

        await When(() => chidi.attemptsTo(
            resolveTicket(),
        ));

        await Then(() => chidi.attemptsTo(
            Ensure.that(ticket(), property('status', equals('resolved'))),
            Ensure.that(ticket('first-ticket'), property('status', equals('open'))),
        ));
    });
});
