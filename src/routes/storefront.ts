import { Hono } from "hono";
import fs from "fs";

export default (app: Hono) => {
  app.get("/fortnite/api/storefront/v2/keychain", (c) => {
    const keychain = JSON.parse(
      fs.readFileSync("./public/responses/catalog/keychain.json", "utf-8")
    );
    return c.json(keychain);
  });

  app.get("/fortnite/api/storefront/v2/catalog", async (c) => {
    const catalog = JSON.parse(
      fs.readFileSync("./public/responses/catalog/catalog.json", "utf-8")
    );
    return c.json(catalog);
  });

  app.get("/catalog/api/shared/bulk/offers", (c) => c.json({}));
};
