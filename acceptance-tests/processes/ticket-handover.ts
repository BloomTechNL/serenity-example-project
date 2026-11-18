import { Process, step, subprocess } from 'serenity-process';

import { changeTicketSubject } from '../interactions/change-ticket-subject';
import { raiseTicket, TicketPriority } from '../interactions/raise-ticket';
import { resolveTicket } from '../interactions/resolve-ticket';

export const ticketHandover = (details: { priority?: TicketPriority } = {}) =>
    Process.where('#customer raises a ticket that #agent resolves',
        step('customer', raiseTicket(details)),
        step('agent', resolveTicket()),
    );

const triage = (newSubject: string) =>
    Process.where('#triager triages the ticket',
        step('triager', changeTicketSubject(newSubject)),
    );

export const escalation = (newSubject: string) =>
    Process.where('#customer raises an urgent ticket that #agent triages and resolves',
        step('customer', raiseTicket({ priority: 'urgent' })),
        subprocess(triage(newSubject), { triager: 'agent' }),
        step('agent', resolveTicket()),
    );
