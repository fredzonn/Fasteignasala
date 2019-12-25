# EA Fasteignir - Lokaverkefni Emils Alfreðssonar
# Leiðbeinandi: Ebba Þóra Hvannberg

## Uppsetning verkefnis

Til þess að keyra verkefnið er nauðsynlegt að hafa Node.js og Postgres uppsett á tölvu.

1. 
Keyra þarf: 
```bash
> git clone https://github.com/fredzonn/Fasteignasala.git
> cd Fasteignasala
```

2. 
Svo þarf að bæta við .env skjali
Stillingarnar sem ég notaði eru:
DATABASE_URL=postgres://postgres:@localhost/lok
HOST=localhost
PORT=7777

3. 
Til þess að sækja pakka og dependency þarf að keyra:
```bash
npm install 
```

4. 
Svo þarf að keyra:
```bash
psql -U *notendanafn* 
```
(postgres í mínu tilfelli).

5. 
Svo þurfum við að búa til gagnagrunnin, keyrum:
```bash
CREATE DATABASE lok; 
```
(lok samkvæmt upplýsingunum sem ég setti í .env).

6. 
Skrifum: 
```bash
\q 
```
Til þess að komast úr postgres í bash.

7. 
Keyrum svo:
```bash
npm run setup
npm run dev
```
Þá ætti serverinn að vera að keyra á - http://127.0.0.1:7777/


