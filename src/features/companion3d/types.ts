export type CompanionExpression =
  | "happy"
  | "curious"
  | "focused"
  | "empathetic"
  | "celebrating"
  | "surprised";

export type CompanionAction =
  | "idle"
  | "greet"
  | "explain"
  | "motivate"
  | "celebrate"
  | "listen";

export type CompanionAvatarProps = {
  expression?: CompanionExpression;
  action?: CompanionAction;
  scale?: number;
};
