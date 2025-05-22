describe('Új autó és tankolás hozzáadása - teszt', () => {
  it('A felhasználó új autót hoz létre és bejegyez egy tankolást', () => {
    cy.visit('http://localhost:4200');

    // Belépés
    cy.get('input[name="email"]').type('teszt.elek@teszt.hu');
    cy.get('input[name="password"]').type('tesztelek');
    cy.contains('Belépés').should('be.visible').click();

    // Autóim oldal betöltése
    cy.contains('Autóim', { timeout: 10000 }).should('be.visible');

    // Új autó űrlap lenyitása
    cy.contains('Új autó hozzáadása', { timeout: 10000 }).should('be.visible');
    cy.get('button').contains('expand_more').click();

    const brand = 'Suzuki';
    const model = 'Swift';
    const year = '2002';
    const engine = '1.3 16v';
    const plate = 'IMV055';

    // Adatok kitöltése, az új autó hozzáadása
    cy.get('input[formcontrolname="brand"]').type(brand);
    cy.get('input[formcontrolname="model"]').type(model);
    cy.get('input[formcontrolname="year"]').type(year);
    cy.get('input[formcontrolname="engine"]').type(engine);
    cy.get('input[formcontrolname="plate"]').type(plate);
    cy.get('button').contains('Mentés').click();

    // Az autó és az adatai megjelennek
    cy.contains(`${brand} ${model}`).should('be.visible');
    cy.contains(`Évjárat: ${year}`).should('be.visible');
    cy.contains(`Motor: ${engine}`).should('be.visible');
    cy.contains(`Rendszám: `).should('be.visible');

    // Katt az autóra
    cy.contains(`${brand} ${model}`).click();

    // Várakozás a tankolási oldal betöltésére
    cy.contains('Új tankolás hozzáadása', { timeout: 10000 }).should('be.visible');

    // Űrlap lenyitása
    cy.get('button').contains('expand_more').click();

    // Dátum automatikusan a mai nap
    const today = new Date().toISOString().split('T')[0];
    //const tenDaysLater  = new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0];
    const odometer = '173500';
    const liters = '36';
    const unitPrice = '585';
    const location = 'OMW 1173';

    // Tankolási adatok kitöltése
    cy.get('input[formcontrolname="date"]').type(today);
    cy.get('input[formcontrolname="odometer"]').type(odometer);
    cy.get('input[formcontrolname="liters"]').type(liters, { force: true });
    cy.get('input[formcontrolname="unitPrice"]').type(unitPrice, { force: true });
    cy.get('input[formcontrolname="location"]').type(location);
    cy.get('mat-select[formcontrolname="fuelType"]').click();
    cy.get('mat-option').contains('Benzin').click();

    // Mentés
    cy.get('button').contains('Mentés').click();

    // Megjelenik az új bejegyzés
    cy.contains(`Tankolt mennyiség: ${liters} L`).should('be.visible');
    cy.contains(`Egységár: ${unitPrice} Ft/L`).should('be.visible');
    cy.contains(`Helyszín: ${location}`).should('be.visible');
    //cy.contains(`Fogyasztás: `).should('be.visible');
  });
});
