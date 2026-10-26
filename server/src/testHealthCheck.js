
import { checkAPIHealth } from "./services/healthCheckService.js";

const result = await checkAPIHealth(
  "https://jsonplaceholder.typicode.com/posts",
  "GET"
);

console.log("Health Check Result:", result);
