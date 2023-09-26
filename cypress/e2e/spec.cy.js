
/// <reference types="cypress" />
describe("Signin", () => {
  it("should register a user with valid email and password", () => {
    cy.visit("http://localhost:5173/Register");

    cy.get('input[name="email"]').type("testcypress@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="confirm_password"]').type("password123");
    cy.get('.form__button').click();


  
  });

  it("should display an error message if email is already in use", () => {
    cy.visit("http://localhost:5173/Register");

    cy.get('input[name="email"]').type("testcypress@example.com");
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