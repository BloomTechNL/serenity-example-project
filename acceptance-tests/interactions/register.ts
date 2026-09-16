import { Actor, Interaction } from '@serenity-js/core';

import { UseScenarioContext } from 'serenity-scenario-context';
import { LoginCredentialContext } from './login-credential-context';
import { AccountRepresentation } from '../../ticketing-system/index';
import { UseSupportDeskApi } from '../use-support-desk-api';

export const register = () =>
    Interaction.where('#actor registers an account', actor => {
        const credentials = LoginCredentialContext.random();

        UseSupportDeskApi.as(actor).post<AccountRepresentation>('/register', {
            username: credentials.username,
            password: credentials.password,
        });

        UseScenarioContext.as(actor).add(credentials, { actor: actor.name });
    });
