import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import parser from '@typescript-eslint/parser';

export default tseslint.config(
  {
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: true,
        projectService: true,
      },
    },
    rules: {
      'no-unused-labels': 0,
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    rules: {
      'no-unused-labels': 'off',
    },
  }
);
