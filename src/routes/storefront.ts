import { Hono } from "hono";
import fs from "fs";
import v1 from "../../public/responses/catalog/v1.json";
import v2 from "../../public/responses/catalog/v2.json";
import { GetVersionInfo } from "../utils/funcs";

export default (app: Hono) => {
  app.get("/fortnite/api/storefront/v2/keychain", (c) => {
    const keychain = JSON.parse(
      fs.readFileSync("./public/responses/catalog/keychain.json", "utf-8")
    );
    return c.json(keychain);
  });

  app.get("/fortnite/api/storefront/v2/catalog", async (c) => {
    const version = GetVersionInfo(c.req).build;

    if (version >= 14.3) {
      return c.json(v2);
    } else {
      return c.json(v1);
    }
  });

  app.get("/catalog/api/shared/bulk/offers", (c) => c.json({}));
};
