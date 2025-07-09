## Catfish Database Project - Frontend

Welcome to the frontend repo for the Catfish database project

## Run

18.20.8
npm run dev

```sh
yarn
yarn dev
```

We prefer `Yarn` as package manager, If you want to use `pnpm` or `npm`, feel free to use

## Tech Stack

- [vite](https://vitejs.dev/)
- [react](https://reactjs.org/)
- [shadcn ui](https://ui.shadcn.com/)
- [react-i18next](https://github.com/i18next/react-i18next)
- [react-lucide](https://lucide.dev/)
- [transmart](https://github.com/Quilljou/transmart)
- [react-query](https://tanstack.com/query/latest/)
- [tailwindcss](https://tailwindcss.com/)
- [less](http://lesscss.org/)
- [postcss](https://postcss.org/)
- [react-router-dom](https://reactrouter.com/en/6.16.0)
- [eslint](https://eslint.org/)/[stylelint](https://stylelint.io/)
- [prettier](https://prettier.io/)
- [svgr](https://react-svgr.com/)
- [editorconfig](https://editorconfig.org/)
- [husky](https://typicode.github.io/husky/#/)/[lint-staged](https://github.com/okonet/lint-staged)
- [commitlint](https://commitlint.js.org/)

## Project Structure

```sh
src
├── app.tsx     # App entry
├── assets      # Assets for images, favicon etc
├── components  # React components
├── hooks       # React hooks
├── i18n        # i18n files
├── lib         # Utils、tools、services
├── main.tsx    # File entry
├── pages       # One .tsx per page
├── router.tsx  # Routers
├── styles      # Less files
├── types       # Typescript types
└── vite-env.d.ts
```

## Vite Configuration

### Application

- VITE_APP_NAME=Catfish Database
- VITE_APP_VERSION=1.0.0
- VITE_APP_ENV=development

### API Configuration

- VITE_API_BASE_URL=http://ec2-34-239-49-92.compute-1.amazonaws.com/api
- VITE_API_TIMEOUT=30000
- VITE_USE_FAKE_BACKEND=false

### Authentication

- VITE_AUTH_TOKEN_KEY=access_token
- VITE_AUTH_REFRESH_TOKEN_KEY=refresh_token
- VITE_AUTH_TOKEN_EXPIRY=3600

### Routing

- VITE_REDIRECT_QUERY_PARAM=r
- VITE_DEFAULT_ROUTE=/

### Feature Flags

- VITE_ENABLE_ANALYTICS=false
- VITE_ENABLE_LOGGING=true
- VITE_ENABLE_ERROR_TRACKING=false

### UI Configuration

- VITE_THEME=light
- VITE_ENABLE_ANIMATIONS=true
- VITE_DATE_FORMAT=YYYY-MM-DD
- VITE_TIME_FORMAT=HH:mm:ss

### Swagger

http://ec2-34-239-49-92.compute-1.amazonaws.com/swagger-ui/index.html

super Admin
alaniomotosho2@gmail.com
Password@123

Farmer
ayomide@gmail.com
Password@123#


