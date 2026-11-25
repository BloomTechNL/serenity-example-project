import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['acceptance-tests/**/*.spec.ts'],
        setupFiles: [
            '@bloom-group/serenity-vitest/setup',
            './acceptance-tests/serenity.setup.ts',
        ],
        reporters: [
            ['@bloom-group/serenity-vitest', {
                specDirectory: 'acceptance-tests',
                crew: [
                    '@serenity-js/console-reporter',
                ],
            }],
        ],
    },
});
