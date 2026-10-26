import { Hono } from "hono";
import { healthBody } from "../shared/health";
import { OrderWorkflow } from "./workflows/order-workflow";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/health", (c) => c.json(healthBody()));

export { OrderWorkflow };
export default app;
