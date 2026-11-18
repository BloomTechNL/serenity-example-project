import { Actor, actorCalled } from '@serenity-js/core';
import { Ensure, equals } from '@serenity-js/assertions';
import { Given, Then, When } from 'test-phase';

import { everyoneSignsUp } from './processes/everyone-signs-up';
import { escalation, ticketHandover } from './processes/ticket-handover';
import { ticket } from './questions/ticket';

describe('A customer and a support agent handing over a ticket', () => {
    let chidi: Actor;
    let priya: Actor;

    beforeEach(() => {
        chidi = actorCalled('Chidi');
        priya = actorCalled('Priya');
    });

    it('lets the customer see a ticket resolved by the agent', async () => {
        await Given(everyoneSignsUp().with({ customer: chidi, agent: priya }));

        await When(ticketHandover().with({ customer: chidi, agent: priya }));

        await Then(() => chidi.attemptsTo(
            Ensure.that(ticket().status, equals('resolved')),
        ));
    });

    it('works the same with the roles swapped', async () => {
        await Given(everyoneSignsUp().with({ customer: priya, agent: chidi }));

        await When(ticketHandover().with({ customer: priya, agent: chidi }));

        await Then(() => priya.attemptsTo(
            Ensure.that(ticket().status, equals('resolved')),
        ));
    });

    it('escalates an urgent ticket that the agent triages before resolving it', async () => {
        await Given(everyoneSignsUp().with({ customer: chidi, agent: priya }));

        await When(escalation('Urgent: printer on fire').with({ customer: chidi, agent: priya }));

        await Then(() => chidi.attemptsTo(
            Ensure.that(ticket().priority, equals('urgent')),
            Ensure.that(ticket().subject, equals('Urgent: printer on fire')),
            Ensure.that(ticket().status, equals('resolved')),
        ));
    });
});
