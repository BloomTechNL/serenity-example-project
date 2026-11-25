import { Actor, actorCalled } from '@serenity-js/core';
import { Ensure, equals, property } from '@serenity-js/assertions';
import { Given, Then, When } from 'test-phase';
import { beforeEach, describe, it } from 'vitest';

import { changeTicketSubject } from './interactions/change-ticket-subject';
import { raiseTicket } from './interactions/raise-ticket';
import { expectedTicket, ticket } from './questions/ticket';
import { signUp } from './tasks/sign-up';

describe('A support agent using the scenario context', () => {
    let priya: Actor;

    beforeEach(() => {
        priya = actorCalled('Priya');
    });

    it('remembers the subject of a raised ticket, matching what the system under test has on record', async () => {
        await Given(() => priya.attemptsTo(
            signUp(),
        ));

        await When(() => priya.attemptsTo(
            raiseTicket(),
        ));

        await Then(() => priya.attemptsTo(
            Ensure.that(
                ticket().subject,
                equals(expectedTicket().subject),
            ),
        ));
    });

    it('remembers the new subject of a ticket whose subject was changed, matching what the system under test has on record', async () => {
        await Given(() => priya.attemptsTo(
            signUp(),

            raiseTicket(),
        ));

        await When(() => priya.attemptsTo(
            changeTicketSubject('A new, more descriptive subject'),
        ));

        await Then(() => priya.attemptsTo(
            Ensure.that(
                ticket().subject,
                equals('A new, more descriptive subject'),
            ),
        ));
    });

    it('changes the subject of a ticket by label, leaving another one untouched', async () => {
        await Given(() => priya.attemptsTo(
            signUp(),

            raiseTicket({ label: 'billing' }),
            raiseTicket({ label: 'login' }),
        ));

        await When(() => priya.attemptsTo(
            changeTicketSubject('Billing query needs a closer look', 'billing'),
        ));

        await Then(() => priya.attemptsTo(
            Ensure.that(ticket('billing'), property('subject', equals('Billing query needs a closer look'))),
            Ensure.that(ticket('login').subject, equals(expectedTicket('login').subject)),
        ));
    });
});
