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
npx prisma migrate dev --name init (migration folder under prisma folder)

Any schema changes:-
prisma db push 

for seed or data push :-
seed file under prisma folder.
add this on package file.
npx prisma db seed
and inspect data : npx prisma studio

##### 5
authentication
jwt and next auth are using.
packages are bcrypt and jsonwebtoken