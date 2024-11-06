import { IProduct } from "./models/IProduct";

export const productSort = (movies: IProduct[], ascending: boolean = true) => {
  return movies.sort((a: IProduct, b: IProduct) => {
    if (ascending) {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
    } else {
      if (a.name > b.name) return -1;
      if (a.name < b.name) return 1;
    }
    return 0;
  });
};