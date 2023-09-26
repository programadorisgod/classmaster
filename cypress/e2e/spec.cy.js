
/// <reference types="cypress" />
describe.skip("Signin", () => {
  it("should register a user with valid email and password", () => {
    cy.visit("http://localhost:5173/Register");

    cy.get('input[name="email"]').type("testcypress1@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="confirm_password"]').type("password123");
    cy.get('.form__button').click();



  });

  it("should display an error message if email is already in use", () => {
    cy.visit("http://localhost:5173/Register");

    cy.get('input[name="email"]').type("testcypress1@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="confirm_password"]').type("password123");

    cy.get('.form__button').click();

    // cy.get(".input__error").should("contain","La cuenta ya existe. Intente con otra dirección de correo..");
  });



  it("should display an error message if password is too short", () => {
    cy.visit("http://localhost:5173/Register");

    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("short");
    cy.get('input[name="confirm_password"]').type("short");
    cy.get('.form__button').click();


    cy.get(".input__error").should(
      "contain",
      "Contraseña debe tener al menos 8 caracteres"
    );
  });
});

describe.skip('should login a user for can delete your account', () => {
  it('should login a user with valid email and password', () => {
    cy.visit('http://localhost:5173/Login');

    cy.get('input[name="email"]').type('testcypress1@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('.forget__input').click();
    cy.get('.form__button').click();


    cy.get('.dropdown').click();
    cy.get('.dropdown-item.1').click();
    cy.get('.configuration-button__delete').click();
    cy.get('#password').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');

    cy.get('#delete__button').click();    



  });


})