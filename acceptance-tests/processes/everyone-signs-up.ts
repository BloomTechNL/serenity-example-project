import { Process, step } from '@bloom-group/serenity-process';

import { signUp } from '../tasks/sign-up';

export const everyoneSignsUp = () =>
    Process.where('#customer and #agent sign up',
        step('customer', signUp()),
        step('agent', signUp()),
    );
