import { configure, engage } from '@serenity-js/core';

import { SupportDeskCast } from './cast';

configure({
    crew: [
        '@serenity-js/console-reporter',
    ],
});

export const mochaHooks = {
    beforeEach(): void {
        engage(new SupportDeskCast());
    },
};
