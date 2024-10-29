import { Expression } from "./Expression";

export class Grouping extends Expression {
    public expression: Expression;

    constructor(expression: Expression) {
        super();
        this.expression = expression;
    }

    public toString(): string {
        return `Grouping { expression: ${this.expression} }`;
    }
}