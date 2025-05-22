describe('Egy autó törlése - teszt', () => {
  it('A felhasználó törli egyik autóját', () => {
    cy.visit('http://localhost:4200');

    // Spy az alert-re
    cy.window().then((win) => {
        cy.stub(win, 'alert').as('windowAlert');
    });

    // Belépés
    cy.get('input[name="email"]').type('teszt.elek@teszt.hu');
    cy.get('input[name="password"]').type('tesztelek');
    cy.contains('Belépés').should('be.visible').click();

    // Autóim oldal betöltése
    cy.contains('Autóim', { timeout: 10000 }).should('be.visible');

    const brand = 'Suzuki';
    const model = 'Swift';
    const year = '2002';
    const engine = '1.3 16v';
    const plate = 'IMV055';

    // Az autó és az adatai megjelennek
    cy.contains(`${brand} ${model}`).should('be.visible');
    cy.contains(`Évjárat: ${year}`).should('be.visible');
    cy.contains(`Motor: ${engine}`).should('be.visible');
    cy.contains(`Rendszám: `).should('be.visible');

    // Az autó törlése
    cy.get('button').contains('Törlés').click();

    // Autóim oldal betöltése
    cy.contains('Autóim', { timeout: 10000 }).should('be.visible');

  });
});