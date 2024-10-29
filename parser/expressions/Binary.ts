import { Expression } from "./Expression";
import { Token } from "../../scanner/Token";

/**
 * Represents a binary expression, such as addition, subtraction, multiplication, or division.
 * Examples include: 1 + 2, 3 * 4, 5 / 6, 7 - 8, etc.
 * 
 * @class Binary
 * @extends Expression
 */
export class Binary extends Expression {
    public left: Expression;
    public operator: Token;
    public right: Expression;

    /**
     * Creates an instance of Binary.
     * 
     * @param {Expression} left - The left-hand side expression.
     * @param {Token} operator - The operator token.
     * @param {Expression} right - The right-hand side expression.
     */
    constructor(left: Expression, operator: Token, right: Expression) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    public toString(): string {
        return `Binary { left: ${this.left}, operator: ${this.operator}, right: ${this.right} }`;
    }
}