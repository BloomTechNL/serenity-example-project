import { engage } from '@serenity-js/core';
import { resetPhase } from '@bloom-group/test-phase';
import { afterEach, beforeEach } from 'vitest';

import { SupportDeskCast } from './cast';

beforeEach(() => {
    engage(new SupportDeskCast());
});

afterEach(() => {
    resetPhase();
});
