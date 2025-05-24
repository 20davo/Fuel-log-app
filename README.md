# Web technológiák 2 – Beadandó
## Tankolásnapló alkalmazás
Az alkalmazás olyan autótulajdonosok számára készült, akik szeretnék nyomon követni tankolásaikat, azok költségeit, és járművük üzemanyag-fogyasztását. Az alkalmazás fejlesztése során a modern MEAN (MongoDB, Express, Angular, Node.js) stack technológiát és Angular Material-t használtam.

---

## Készítette
- **Név:** Szauter Dávid  
- **Neptun kód:** P4QKJP  

---

## Használt technológiák és verziók
- **Node.js** v22.14.0
- **npm** 10.9.2
- **Angular CLI** 19.2.12
- **MongoDB** 2.5.0

---

## Környezeti változók (backend/.env)
```dotenv
PORT=5000
MONGO_URL=mongodb://localhost:27017/beadando
JWT_SECRET=valami_super_titkos_kulcs
```

---

## Funkciók
- Regisztráció és bejelentkezés
- Autók hozzáadása, törlése
- Tankolások rögzítése egy-egy autóhoz
- Átlagfogyasztás számítás
- Token alapú autentikáció (JWT)
- Angular Material felület, világos/sötét téma (egyelőre csak a basics)
- Input validáció és formázás

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

## Képernyőképek

![Regisztrációs oldal](assets/images/register.png)
![Login oldal](assets/images/login.png)
![Autóim főoldal](assets/images/cars.png)
![Tankolási napló](assets/images/refuel.png)
