import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";

type OrderWorkflowParams = Record<string, never>;

export class OrderWorkflow extends WorkflowEntrypoint<Env, OrderWorkflowParams> {
  run(_event: WorkflowEvent<OrderWorkflowParams>, _step: WorkflowStep): Promise<void> {
    return Promise.resolve();
  }
}
