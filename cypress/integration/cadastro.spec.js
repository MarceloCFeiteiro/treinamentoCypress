/// <reference types="cypress"/>

let Chance = require("chance");
let chance = new Chance();

context('Cadasto', () => {
    it('Cadastro de novo usuário', () => {

        //rotas
        //POST 200 /api/1/databases/userdetails/collections/newtable?apiKey=YEX0M2QMPd7JWJw_ipMB3a5gDddt4B_X
        //POST 200 /api/1/databases/userdetails/collections/usertable?apiKey=YEX0M2QMPd7JWJw_ipMB3a5gDddt4B_X
        //GET 200 /api/1/databases/userdetails/collections/newtable?apiKey=YEX0M2QMPd7JWJw_ipMB3a5gDddt4B_X

        cy.server();
        cy.route('POST', '**/api/1/databases/userdetails/collections/newtable?**').as('postNewtable');
        cy.route('POST', '**/api/1/databases/userdetails/collections/usertable?**').as('postUsertable');
        cy.route('GET', '**/api/1/databases/userdetails/collections/newtable?**').as('getNewtable');

        cy.visit('Register.html');

        //type
        cy.get("input[placeholder='First Name']").type(chance.first());
        cy.get("input[ng-model^=Last]").type(chance.last());
        cy.get("input[ng-model^=Email]").type(chance.email());
        cy.get("input[ng-model^=Phone]").type(chance.phone({ formatted: false }));

        //check radio's and checkboxes
        cy.get("input[value=FeMale]").check();
        cy.get("input[type=checkbox]").check('Cricket');
        cy.get("input[type=checkbox]").check('Hockey');

        //select e select2(combos)
        cy.get("select#Skills").select("Javascript");
        cy.get("select#countries").select("Argentina");
        cy.get("select#country").select("Australia", { force: true });
        cy.get("select#yearbox").select("1996");
        cy.get("select[ng-model^=month]").select("February");
        cy.get("select#daybox").select("24");

        cy.get("input#firstpassword").type("Agilizei@2020");
        cy.get("input#secondpassword").type("Agilizei@2020");

        //attachFile -> inputFile
        cy.get('input#imagesrc').attachFile("Foto.PNG");

        cy.get("button#submitbtn").click();

        cy.wait("@postNewtable").then((resNewtable) => {
            expect(resNewtable.status).to.eq(200);
        });

        cy.wait("@postUsertable").then((resUsertable) => {
            expect(resUsertable.status).to.eq(200);
        });

        cy.wait("@getNewtable").then((resNewtable) => {
            expect(resNewtable.status).to.eq(200);
        });

        cy.url().should("contain","WebTable");

    });
});

