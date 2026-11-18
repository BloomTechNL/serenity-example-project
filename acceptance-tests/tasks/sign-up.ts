import { Task } from '@serenity-js/core';

import { login } from '../interactions/login';
import { register } from '../interactions/register';

export const signUp = () =>
    Task.where('#actor signs up',
        register(),
        login(),
    );
