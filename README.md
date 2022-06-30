# My Next kit

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Includes
- #### [Prisma](https://www.prisma.io/)
- #### Cms gql connection ([Strapi](https://strapi.io/))
- #### Session middleware ([jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) + [cookie](https://www.npmjs.com/package/cookie))
- #### Captcha middleware ([HCaptcha](https://www.hcaptcha.com/))
- #### [PlopJS](https://plopjs.com/)

## Getting Started
#### Setup Database with Prisma:
[https://www.prisma.io/docs/getting-started](https://www.prisma.io/docs/getting-started)
1. Setup db connection and db schema inside `prisma/schema.prisma`
2. Migrate DB 
yarn prisma:migrate
```
3. Generate prisma client after migrate
```bash
yarn prisma:generate
```

#### Run the development server:
```bash
yarn dev
```

Open [http://localhost:12000](http://localhost:12000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.
The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

#### Create Component / Context with Plop Generator:
```bash
$ yarn plop:component
? Component name (PascalCase) MyComponent
```

Then the Component's directory will be populated with its starting files.
```bash
✔  ++ <root>/component/MyComponent/README.md
✔  ++ <root>/component/MyComponent/index.jsx
✔  ++ <root>/component/MyComponent/index.scss
✔  ++ <root>/component/MyComponent/context.jsx
✔  ++ <root>/component/MyComponent/__tests__/index.test.jsx
✨  Done.
```

#### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
