import type { Token } from "../../scanner/Token";
import { Expression } from "./Expression";

export class Unary extends Expression {
    public operator: Token;
    public right: Expression;

    constructor(operator: Token, right: Expression) {
        super();
        this.operator = operator;
        this.right = right;
    }

    public toString(): string {
        return `Unary { operator: ${this.operator}, right: ${this.right} }`;
    }
}