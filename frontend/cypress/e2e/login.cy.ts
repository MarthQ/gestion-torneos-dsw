describe('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/explore');
  });

  it('should login successfully and redirect to explore', () => {
    cy.get('#sidebar-toggle').click();
    cy.get('[data-tip="Login"]').click();
    cy.url().should('include', '/auth/login');

    cy.get('input[type="email"]').type('jose.socolsky@gmail.com');
    cy.get('input[type="password"]').type('polaco123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/explore');
  });

  it('should show validation errors when submitting empty form', () => {
    cy.get('#sidebar-toggle').click();
    cy.get('[data-tip="Login"]').click();
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/auth/login');
  });
});