import { http, HttpResponse } from "msw";
import db from "../../datasets/db.json";

export const handlers = [
  http.get("https://localhost:3001/orders"),
  () => {
    return HttpResponse.json([db.orders]);
  },
];
