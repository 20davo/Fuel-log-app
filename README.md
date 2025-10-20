# Web technológiák 2 – Beadandó
## Tankolásnapló alkalmazás
Egyszerű, minimalista eszköz tankolások nyilvántartására. Segítségével könnyedén nyomon követhetők a tankolási költségek és a jármű üzemanyag-fogyasztása. Az alkalmazás fejlesztése során a modern MEAN (MongoDB, Express, Angular, Node.js) stack technológiát és Angular Material-t használtam.

---

## Készítette
- **Név:** Szauter Dávid  
- **Neptun kód:** P4QKJP  

---

## Használt technológiák
- **Node.js** v22.14.0
- **npm** 10.9.2
- **Angular CLI** 19.2.12
- **MongoDB** 2.5.0

---

## Funkciók
- Regisztráció és bejelentkezés
- Autók hozzáadása, törlése
- Tankolások rögzítése egy-egy autóhoz
- Átlagfogyasztás számítás
- Token alapú autentikáció (JWT)
- Angular Material felület
- Input validáció és formázás

---

## Fejlesztési jegyzőkönyv

### Backend felépítése

A backend Node.js és Express segítségével készült. Biztosítja a felhasználói regisztrációt és bejelentkezést, kezeli az autókat és rögzíti azok tankolási adatait, valamint lehetővé teszi ezek lekérdezését és törlését a MongoDB adatbázisból.

#### Alapbeállítások
A backend szerver a `localhost:5000` porton fut, az adatbázis pedig a `mongodb://localhost:27017/beadando` címen érhető el. A kommunikáció REST API-n keresztül történik, JSON formátumban. A környezeti változókat az `.env` fájl tárolja (`PORT`, `MONGO_URL`, `JWT_SECRET`).

#### Főbb route-ok

- **/auth** – Ide tartozik a regisztráció és bejelentkezés. A jelszavak hashelése bcrypt-tel történik, sikeres bejelentkezést követően JWT (Json Web Token) tokent ad vissza a kliensnek.
- **/cars** – Itt lehet új autókat hozzáadni (validációval), lekérdezni és törölni. A felhasználó csak a saját járműveihez fér hozzá.
- **/refuel** – Ez kezeli az egyes autókhoz tartozó tankolási bejegyzéseket. A backend számolja a fizetett összeget (az egységár és a megadott liter alapján) illetve, ha van előző tankolási adat, akkor a fogyasztást is.

#### `server.js`
Ez a szerverindító fájl. Itt történik az alap konfigurálás (CORS, JSON feldolgozás), az útvonalak csatlakoztatása és az adatbázishoz való kapcsolódás. Tartalmaz egy egyszerű `/ping` végpontot is teszteléshez.

#### Middleware-k

- **`verifyToken.js`** – Minden védett útvonalnál ellenőrzi, hogy van-e érvényes JWT token, és ha igen, kinyeri belőle a felhasználói azonosítót.
- **`validateObjectId.js`** – Lekérdezések előtt ellenőrzi, hogy az ID-k jól formázott MongoDB azonosítók legyenek.

#### Modellek

A rendszer három fő adatmodellt használ:

- **User** – A felhasználó neve, e-mail címe, jelszava (titkosítva), valamint a regisztráció időpontja.
- **Car** – Autóadatok (márka, típus, évjárat, motor, rendszám). Minden autó egy adott felhasználóhoz tartozik, és ahhoz csakis ő férhet hozzá.
- **RefuelEntry** – Tankolási bejegyzések dátummal, kilométeróra-állással, litermennyiséggel, egységárral illetve fizetett összeggel és fogyasztással. Minden bejegyzés egy adott autóhoz tartozik, és csakis annak tulajdonosa férhet hozzá.

---

### Frontend felépítése

A frontend Angular és Angular Material segítségével készült. Ez biztosítja a felhasználók számára az egyszerű kezelőfelületet, amelyen keresztül regisztrálhatnak, bejelentkezhetnek, kezelhetik autóikat, és rögzíthetik azok tankolási adatait.

#### Alapbeállítások

Az alkalmazás a `localhost:4200` címen érhető el alapértelmezetten. A backenddel REST API segítségével kommunikál JSON formátumban. Az API URL-je az `environment.ts` fájlban van definiálva.

#### Routing (útvonalak)

Az útvonalakat az `app.config.ts`-ben állítottam be. A biztonságos navigációt (token-alapú ellenőrzés) az `AuthGuard` biztosítja, ami megakadályozza az illetéktelen hozzáférést.

- `/` – Bejelentkezési oldal (`LoginComponent`)
- `/register` – Regisztrációs oldal (`RegisterComponent`)
- `/account` – Fiók főoldal (`AccountComponent`)
  - `/account/cars` – Autók listája és kezelése (`CarListComponent`)
  - `/account/cars/:id` – Egy adott autó tankolási adatai (`CarLogComponent`)

#### Komponensek

- **LoginComponent** – E-maillel és jelszóval való belépés. Sikeres belépéskor a JWT token mentésre kerül a Local Storage-ba.
- **RegisterComponent** – Egyszerű regisztrációs űrlap (név, email, jelszó). Regisztráció után visszairányít a beléptető oldalra.
- **AccountComponent** – A bejelentkezett felhasználó főoldala. Innen érhetők el az alkalmazás főbb funkciói, egyelőre két menüpont (autóim, kijelentkezés). A témaváltó ikon is itt található, ami egyelőre csak vizuálisan jelenik meg, funkció nélkül.
- **CarListComponent** – Autók listázása, hozzáadása (validációval), törlése.  
  A rendszám megadásakor kizárólag a Magyarországon jelenleg érvényes formátumokat fogadja el:  
  - **Régi típus:** `ABC-123`  
  - **Új típus:** `AA BB-123`

- **CarLogComponent** – Kiválasztott autóhoz tartozó tankolási adatok kezelése, létrehozás (validációval), törlés. A dátum inputot beíráskor formázza.

#### Szolgáltatások (`services`)

- **AuthService** – A felhasználói hitelesítést kezeli (regisztráció, bejelentkezés, JWT token mentése, lekérdezése és törlése). Hibás vagy lejárt token esetén automatikus kijelentkezteti a felhasználót.
- **CarService** – Az autókhoz kapcsolódó backend-kommunikációért felel. Az éppen bejelentkezett felhasználó járműveinek kezelését végzi (lekérdezés, hozzáadás, törlés).

- **AuthInterceptor** *(interceptor)* – Közbeékelődik minden HTTP kérésbe, és automatikusan hozzáfűzi a JWT tokent az `Authorization` fejlécben, megkönnyítve ezzel a backend hitelesítést.
- **AuthGuard** *(útvonalvédelem)* – Megakadályozza a hozzáférést védett oldalakhoz, ha nincs érvényes JWT token. Hiba esetén kijelentkezteti és a bejelentkezési oldalra irányítja a felhasználót.

---

## Tesztelés

Az alkalmazás működésének ellenőrzése manuálisan, valamint Cypress alapú end-to-end (e2e) tesztekkel is megtörtént. A tesztek az alábbi főbb funkciókra terjedtek ki:

- Felhasználói regisztráció és bejelentkezés.
- Autók hozzáadása, listázása és törlése.
- Tankolási bejegyzések rögzítése, megjelenítése és eltávolítása.
- Az űrlap validációk megfelelő működésének ellenőrzése.
- JWT token érvényességének ellenőrzése, automatikus kijelentkeztetés annak lejárata esetén.

Az alkalmazás felhasználói felülete teljesen reszponzív, így eltérő kijelzőméreteken – mobilon, tableten és asztali gépen – egyaránt megfelelően jelenik meg és kényelmesen használható.

---

## Futtatás

```
cd backend
npm install
node server.js
```

```
cd frontend
npm install
ng serve
```

---

## Előnézet (képernyőképek)

### Regisztrációs oldal
![Regisztrációs oldal](assets/images/register.png)

### Beléptető oldal
![Login oldal](assets/images/login.png)

### Fiók főoldala, autóim oldal
![Autóim főoldal](assets/images/cars.png)

### Egy autó tankolási naplója
![Tankolási napló](assets/images/refuel.png)
