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
and inspect data : npx prisma studio.

##### 5
authentication
jwt and next auth are using.
packages are bcrypt and jsonwebtoken.


###### 6
No need to pass token manually - session cookies handle it.
example for protected route :- getServerSession else no need for getServerSession().
needs literal string values - it can't use imported constants because Next.js parses this at build time before your code runs.


###### 7
state management :- zustand and react hooks.


###### 8
env sample :- 
DATABASE_URL = "   "
DB_SUPABASE_URL = "   "
NEXTAUTH_URL = http://localhost:3000
NEXT_PUBLIC_BASE_URL = http://localhost:3000
NEXTAUTH_SECRET = "    "


##### 9
working :- 
    1.Remember Me" is checked
      checks token expiry every 10 seconds.
      5 minutes remain, warning modal appears
      User can either dismiss or extend the session
    2.Remember Me" is unchecked
     immediate logout


eturn {
            id: user.id,
            email: user.email,
            name: user.name,
            accessToken: generateAccessToken(user.id), // Generate your JWT token here
        };

