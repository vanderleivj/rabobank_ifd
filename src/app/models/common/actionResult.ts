export interface ActionResult {
  message: string;
  code: ActionCode;
  data?: any;
}

export enum ActionCode {
  error = 500,
  success = 200,
}
