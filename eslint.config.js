// import js from '@eslint/js';
// import globals from 'globals';
// import tseslint from 'typescript-eslint';
// import pluginReact from 'eslint-plugin-react';
// import { defineConfig, globalIgnores } from 'eslint/config';
// import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
// // import reactHooks from 'eslint-plugin-react-hooks';

// export default defineConfig([
//   {
//     files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
//     plugins: {
//       js,
//       'jsx-a11y': pluginJsxA11y.configs.recommended,
//       // 'react-hooks': reactHooks.configs.recommended,
//     },
//     extends: [
//       // 'react-hooks/recommended',
//       // 'airbnb-standard',
//       // 'eslint:recommended',
//       // 'plugin:react-hooks/recommended',
//       // 'plugin:import/typescript',
//       // 'plugin:prettier/recommended',
//     ],
//     rules: {
//       // ...pluginJsxA11y.configs.recommended.rules,
//       'react/jsx-uses-react': 'off',
//       'react/react-in-jsx-scope': 'off',
//       // 'react-hooks/rules-of-hooks': 'error',
//       // 'react-hooks/exhaustive-deps': 'warn',
//     },
//     languageOptions: {
//       globals: globals.browser,
//       parserOptions: {
//         ecmaFeatures: {
//           jsx: true,
//         },
//         sourceType: 'module',
//       },
//     },
//   },
//   // reactHooks.configs.recommended,
//   tseslint.configs.recommended,
//   pluginReact.configs.flat.recommended,
//   globalIgnores(['jest.setup.js', 'src/tests/**/*']),
// ]);

// import js from '@eslint/js';
// import globals from 'globals';
// import tseslint from 'typescript-eslint';
// import pluginReact from 'eslint-plugin-react';
// import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
// import pluginPrettier from 'eslint-plugin-prettier';
// import { defineConfig, globalIgnores } from 'eslint/config';

// export default defineConfig([
//   {
//     files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

//     plugins: {
//       js,
//       react: pluginReact,
//       'jsx-a11y': pluginJsxA11y,
//       prettier: pluginPrettier,
//     },

//     extends: [
//       // Bạn có thể dùng các flat-compatible extends:
//       js.configs.recommended,
//       ...tseslint.configs.recommended,
//       pluginReact.configs.flat.recommended,
//       // pluginJsxA11y.configs.recommended // rules đã merge trực tiếp trong rules
//     ],

//     rules: {
//       // Rules Prettier
//       'prettier/prettier': 'error',

//       // React basic rules
//       'react/jsx-uses-react': 'off',
//       'react/react-in-jsx-scope': 'off',

//       // JSX A11y rules
//       ...pluginJsxA11y.configs.recommended.rules,

//       // Bạn có thể thêm rule của React Hooks nếu cần
//       // 'react-hooks/rules-of-hooks': 'error',
//       // 'react-hooks/exhaustive-deps': 'warn',
//     },

//     languageOptions: {
//       globals: globals.browser,
//       parserOptions: {
//         ecmaVersion: 'latest',
//         sourceType: 'module',
//         ecmaFeatures: {
//           jsx: true,
//         },
//       },
//     },
//   },

//   tseslint.configs.recommended,
//   pluginReact.configs.flat.recommended,
//   globalIgnores(['jest.setup.js', 'src/tests/**/*']),
// ]);

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginPrettier from 'eslint-plugin-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,ts,tsx}'],

    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginJsxA11y,
      prettier: pluginPrettier,
    },

    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      pluginReact.configs.flat.recommended,
    ],

    rules: {
      // Prettier
      'prettier/prettier': 'error',

      // React
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': "off",

      // JSX A11y
      ...pluginJsxA11y.configs.recommended.rules,

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },

    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
  },

  globalIgnores(['jest.setup.js', 'src/tests/**/*']),
]);
