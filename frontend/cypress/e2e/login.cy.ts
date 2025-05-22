describe('Regisztráció, bejelentkezés - teszt', () => {
  it('A felhasználó regisztrál, majd bejelentkezik a fiókjába', () => {

    cy.visit('http://localhost:4200');

    // Spy az alert-re
    cy.window().then((win) => {
        cy.stub(win, 'alert').as('windowAlert');
    });

    // Katt a linkre a regisztrációs oldalhoz
    cy.contains('Nincs fiókod? Regisztrálj itt!').click();

    // A regisztrációs űrlap kitöltése
    cy.get('input[name="name"]').type('Teszt Elek');
    cy.get('input[name="email"]').type('teszt.elek@teszt.hu');
    cy.get('input[name="password"]').type('tesztelek');
    cy.contains('Regisztrálok').click();

    // Assert, hogy az alert tényleg lefutott
    cy.get('@windowAlert').should('have.been.calledWith', 'Sikeres regisztráció!');

    // Regisztrációt követően automatikusan visszairányít a login oldalra – ott bejelentkezés
    cy.get('input[name="email"]').type('teszt.elek@teszt.hu');
    cy.get('input[name="password"]').type('tesztelek');
    cy.contains('Belépés', { timeout: 10000 }).should('be.visible').click();

    // Az „Autóim” szöveg megjelenik-e
    cy.contains('Autóim', { timeout: 10000 }).should('be.visible');

    // URL ellenőrzése
    cy.url().should('include', '/account');
  });
});
