import { Hono } from "hono";
import { v4 as uuid } from "uuid";

export default (app: Hono) => {
  app.get("/party/api/v1/Fortnite/user/*", (c) =>
    c.json({
      current: [],
      pending: [],
      invites: [],
      pings: [],
    })
  );

  app.post("/party/api/v1/Fortnite/parties", async (c) => {
    const body = await c.req.json().catch(() => ({}));

    if (!body.join_info) return c.json({});
    if (!body.join_info.connection) return c.json({});

    const connection = body.join_info.connection;
    const id = uuid().replace(/-/g, "");
    const now = new Date().toISOString();

    return c.json({
      id,
      created_at: now,
      updated_at: now,
      config: {
        type: "DEFAULT",
        ...body.config,
        discoverability: "ALL",
        sub_type: "default",
        invite_ttl: 14400,
        intention_ttl: 60,
      },
      members: [
        {
          account_id: (connection.id || "").split("@prod")[0],
          meta: body.join_info.meta || {},
          connections: [
            {
              id: connection.id || "",
              connected_at: now,
              updated_at: now,
              yield_leadership: false,
              meta: connection.meta || {},
            },
          ],
          revision: 0,
          updated_at: now,
          joined_at: now,
          role: "CAPTAIN",
        },
      ],
      applicants: [],
      meta: body.meta || {},
      invites: [],
      revision: 0,
      intentions: [],
    });
  });

  app.all("/party/api/v1/Fortnite/parties/*", (c) => c.body(null, 204));
};
