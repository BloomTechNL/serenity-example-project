import { Process, step } from '@bloom-group/serenity-process';

import { raiseTicket, TicketPriority } from '../interactions/raise-ticket';
import { resolveTicket } from '../interactions/resolve-ticket';
import { triageTicket } from '../tasks/triage-ticket';

export const ticketHandover = (details: { priority?: TicketPriority } = {}) =>
    Process.where('#customer raises a ticket that #agent resolves',
        step('customer', raiseTicket(details)),
        step('agent', resolveTicket()),
    );

export const escalation = (newSubject: string) =>
    Process.where('#customer raises an urgent ticket that #agent triages and resolves',
        step('customer', raiseTicket({ priority: 'urgent' })),
        step('agent', triageTicket(newSubject), resolveTicket()),
    );
