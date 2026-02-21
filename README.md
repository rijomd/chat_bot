## Getting Started

## schema.prisma  
 edit this file manually whenever you want to add a table or a field.

## migration.sql
generated automatically by Prisma inside the prisma/migrations folder when you run npx prisma migrate dev

##### 1
npm install
npm run db:migrate
npm run db:seed


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

prisma client regenerate 
npx prisma generate

migration changes initially:-
npx prisma migrate dev --name init (migration folder under prisma folder) (eg :- npx prisma migrate dev --name migrations)

Any schema changes:-
prisma db push 

for seed or data push :-
seed file under prisma folder.
add this on package file.

npm run db:migrate
npm run db:seed
for view :- npm run db:studio


for clear cache
Remove-Item -Recurse -Force node_modules\.prisma
then run migration

##### 5
authentication
jwt and next auth are using.
packages are bcrypt and jsonwebtoken.


###### 6
No need to pass token manually - session cookies handle it.
example for protected route :- getServerSession else no need for getServerSession().
needs literal string values - it can't use imported constants because Next.js parses this at build time before your code runs.


###### 7
state management :- react hooks.


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
      checks token expiry every no.of (defined) seconds.
      5(defined) minutes remain, warning modal appears.
      User can either dismiss or extend the session.
    2.Remember Me" is unchecked
      immediate logout

###### 10
 auth.ts => signout for   
             signOut() called
             session destroyed
             events.signOut runs (optional hook) :- Optional: Add backend cleanup here if needed
