import { Task } from '@serenity-js/core';

import { changeTicketSubject } from '../interactions/change-ticket-subject';

export const triageTicket = (newSubject: string) =>
    Task.where('#actor triages the ticket',
        changeTicketSubject(newSubject),
    );
