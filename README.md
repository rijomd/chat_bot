## Getting Started

##### 1

First, run the development server:

npm run dev
yarn dev
pnpm dev
bun dev

##### 2  

create next with prisma :  installation

npx create-next-app@latest nextjs-prisma
npm install prisma tsx --save-dev
npm install @prisma/extension-accelerate @prisma/client
npx prisma init
npx prisma generate

##### 3

prisma folder contains schema.prisma file and model declarations.
.env add db url

##### 4

migration changes initially:-
npx prisma migrate dev --name init 
Any schema changes:-
prisma db push