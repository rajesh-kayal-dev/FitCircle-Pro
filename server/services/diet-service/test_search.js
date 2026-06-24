import { searchDietTracker } from "./src/services/search.service.js";

searchDietTracker("egg")
  .then(console.log)
  .catch(console.error);
