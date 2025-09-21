# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Approach

### Option 1. Brute Force

**Method:** Fetch all colors for the 360 hue values.

This results in the worst time complexity and most API calls.

Pros:
* Since we're not being rate limited, all the API calls can be made in parallel and the time for a full render of all colors is fast

Cons:
* Excessive API calls

## Option 2. Exponential Jump + Linear Backtracking

**Method:** When we encounter a new color, jump exponentially until we encounter a new color, and backtrack linearly until we hit the same color again so that we know where the start of the next color is.

Pros:
* Less API calls because we can skip forward

Cons:
* Can't run this in parallel because we need to know where the previous color ends before continuing onto the next.

S = 100%, L = 50% -> Total API calls: 240
S = 90%, L = 47% -> Total API calls: 194
S = 40%, L = 87% -> Total API calls: 179

## 3. Exponential Jump + Binary Search

S = 100%, L = 50% -> Total API calls: 215
S = 90%, L = 47% -> Total API calls: 184
S = 90%, L = 47% -> Total API calls: 118

## 4. Exponential Jump + Binary Search / Linear Backtrack

S = 100%, L = 50% -> Total API calls: 215
S = 90%, L = 47% -> Total API calls: 184
S = 90%, L = 47% -> Total API calls: 118

## Additional Improvements

* Cache the results so when the user wants to search again, then no API calls are needed because the data was already fetched
