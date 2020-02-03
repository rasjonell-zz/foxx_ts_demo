import joi from "joi";
import { db } from "@arangodb";

interface IUser extends ArangoDB.Document {
  email?: string;
  username?: string;
}

export default function hello(router: Foxx.Router): Foxx.Router {
  router
    .get("/hello", (_req: Foxx.Request, res: Foxx.Response) => {
      const result: string = "Hello World!";

      res.send({ result });
    })
    .response(
      joi
        .object({
          result: joi.string().required()
        })
        .required(),
      "result"
    )
    .summary("Returns hello world")
    .description("Example route that sends hello world message");

  router
    .post("/user", function(req: Foxx.Request, res: Foxx.Response) {
      try {
        const user: IUser = req.body;

        const users: ArangoDB.Collection = db.users;

        const meta: IUser = users.save(user);
        const data: IUser = { ...user, ...meta };

        res.send({ data });
      } catch (e) {
        // Failed to save the user
        // We'll assume the uniqueness constraint has been violated
        res.throw("bad request", "Username already taken", e);
      }
    })
    .body(
      joi
        .object({
          email: joi.string().required(),
          username: joi.string().required()
        })
        .required(),
      "User Info"
    )
    .description("Creates a new user.");

  return router;
}
