import { Interaction } from '@serenity-js/core';

import { Qualifiers, UseScenarioContext } from 'serenity-scenario-context';
import { TicketRepresentation } from '../../ticketing-system/index';
import { UseSupportDeskApi } from '../use-support-desk-api';

import {TicketContext} from "./ticket-context";

export const resolveTicket = (label?: string) =>
    Interaction.where(
        label ? `#actor resolves the ticket labelled ${ label }` : '#actor resolves the ticket in the spotlight',
        actor => {
            const qualifiers: Qualifiers = label ? { label } : {};
            const ticketContext = UseScenarioContext.as(actor).find(TicketContext, qualifiers);

            UseSupportDeskApi.as(actor).post<TicketRepresentation>(
                `/tickets/${ ticketContext.id }/resolve`, undefined, 200,
            );
        },
    );
