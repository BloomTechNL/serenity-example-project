import tseslint from 'typescript-eslint';
import testPhase from '@bloom-group/test-phase/eslint-plugin';

export default [
    {
        files: ['acceptance-tests/**/*.spec.ts'],
        languageOptions: { parser: tseslint.parser },
        plugins: { 'test-phase': testPhase },
        rules: {
            'test-phase/no-assertions-in-given-or-when': ['error', { assertions: ['Ensure'] }],
            'test-phase/one-given-when-then-per-test': 'error',
        },
    },
];
