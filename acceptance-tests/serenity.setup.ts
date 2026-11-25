import { engage } from '@serenity-js/core';
import { resetPhase } from 'test-phase';
import { afterEach, beforeEach } from 'vitest';

import { SupportDeskCast } from './cast';

beforeEach(() => {
    engage(new SupportDeskCast());
});

afterEach(() => {
    resetPhase();
});
