describe("Testing movie app", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

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
  it("should take a search query and display the results", () => {
    cy.get("input#searchText").type("star");
    cy.get("button").contains("Sök").click();
    cy.get("section#searchresult").should("exist");
  });
  it("should have a sorting on the result", async () => {
    // Intercept the search request and provide a mock response
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

    // Trigger the search action
    cy.get("button#search").contains("Sök").click();

    // Wait for the intercepted request
    cy.wait("@getProducts").then((interception) => {
      console.log("Intercepted request:", interception);
    });

    // Click on the sorting button (assuming there's a button for sorting)
    cy.get("button#sort").contains("Sortera").click();

    // Verify the results are sorted in ascending order
    cy.get("section#searchresult").within(() => {
      cy.get("div.movie").should("have.length", 3);
      cy.get("div.movie").eq(0).contains("Inception");
      cy.get("div.movie").eq(1).contains("Interstellar");
      cy.get("div.movie").eq(2).contains("The Matrix");

      // Verify the results are sorted in descendin order
      cy.get("button#sort").contains("Sortera").click();
      cy.get("div.movie").should("have.length", 3);
      cy.get("div.movie").eq(0).contains("The Matrix");
      cy.get("div.movie").eq(1).contains("Interstellar");
      cy.get("div.movie").eq(2).contains("Inception");

    });
  });
});
