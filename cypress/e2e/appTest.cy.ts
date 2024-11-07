describe("Testing movie app", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  //test elements 
  it("should have a form to search Films", () => {
    cy.get("form#searchform").within(() => {
      cy.get("input#searchText").should("exist");
      cy.get("button").contains("Sök").should("exist");
      cy.get("button#sort").should("exist");
    });
  });
  
  it("should have a section of Films result", () => {
    cy.get("section#searchresult").should("exist");
  });
  //checking functionalities
  it("should take a search query and display the results", () => {
    cy.get("input#searchText").type("star");
    cy.get("button").contains("Sök").click();
    cy.get("div.movie").should("have.length.gte", 1);
  });
  
  it("should display a message when no results are found", () => {
    cy.intercept(
      "https://medieinstitutet-wie-products.azurewebsites.net/api/search?searchtext=*",
      {
        body: [],
      }
    ).as("getProducts");

    cy.get("input#searchText").type("Harry Potter");

    
    cy.get("button#search").contains("Sök").click();
    
    cy.wait("@getProducts");

    cy.get("p").contains("Inga sökresultat att visa");
  });
  it("should create a movie element for the result", () => {
    cy.intercept(
      "https://medieinstitutet-wie-products.azurewebsites.net/api/search?searchtext=*",

      [{ name: "The Matrix", imageUrl: "https://picsum.photos/200" }]
    );

    cy.get("button#search").contains("Sök").click();

    cy.get("div.movie").within(() => {
      cy.get("h3").should("contain.text", "The Matrix");
      cy.get("div").within(() => {
      cy.get("img").should("have.attr", "src", "https://picsum.photos/200");
      });
    });
  });
  it("should have a sorting on the result", () => {
      cy.intercept(
        "https://medieinstitutet-wie-products.azurewebsites.net/api/search?searchtext=*",
        {
          body: [
            { name: "The Matrix", imageUrl: "https://picsum.photos/200" },
            { name: "Inception", imageUrl: "https://picsum.photos/200" },
            { name: "Interstellar", imageUrl: "https://picsum.photos/200" },
          ],
        }
      ).as("getProducts");
    
      cy.get("button#search").contains("Sök").click();
    
      cy.wait("@getProducts").then((interception) => {
        console.log("Intercepted request:", interception);
      });
    
      cy.get("button#sort").contains("Sortera").click();
    
     
    // Verify the results are sorted in ascending order
    cy.get("section#searchresult").within(() => {
      cy.get("div.movie").should("have.length", 3).then((movies) => {
        cy.wrap(movies).eq(0).contains("Inception");
        cy.wrap(movies).eq(1).contains("Interstellar");
        cy.wrap(movies).eq(2).contains("The Matrix");
      });

    });
    // Verify the results are sorted in descending order
    cy.get("button#sort").contains("Sortera").click();
    
    cy.get("section#searchresult").within(() => {
      cy.get("div.movie").should("have.length", 3).then((movies) => {
        cy.wrap(movies).eq(0).contains("The Matrix");
        cy.wrap(movies).eq(1).contains("Interstellar");
        cy.wrap(movies).eq(2).contains("Inception");
      });
    });
    });
  });


