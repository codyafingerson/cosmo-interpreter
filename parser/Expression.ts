import type { Token } from "../scanner/Token";

/**
 * An expression represents a value in the language.
 * @abstract
 */
export abstract class Expression { }

/**
 * An assignment expression, such as `a = 1`.
 */
export class Assign extends Expression {
    public name: Token;
    public value: Expression;

    constructor(name: Token, value: Expression) {
        super();
        this.name = name;
        this.value = value;
    }

    public toString(): string {
        return `Assign { name: ${this.name}, value: ${this.value} }`;
    }
}

/**
 * Represents a binary expression, such as addition, subtraction, multiplication, or division.
 */
export class Binary extends Expression {
    public left: Expression;
    public operator: Token;
    public right: Expression;

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

/**
 * Represents a grouping expression, such as `(1 + 2)`.
 */
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

/**
 * Represents a literal expression, such as `1`, `2.5`, or `"hello"`.
 */
export class Literal extends Expression {
    public value: any;

    constructor(value: any) {
        super();
        this.value = value;
    }

    public toString(): string {
        return `Literal { value: ${this.value} }`;
    }
}

/**
 * Represents a unary expression, such as `-1` or `!true`.
 */
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

/**
 * Represents a variable expression, such as `a`.
 */
export class Variable extends Expression {
    public name: Token;

    constructor(name: Token) {
        super();
        this.name = name;
    }

    public toString(): string {
        return `Variable { name: ${this.name} }`;
    }
}

/**
 * Represents a logical expression, like `true and false`.
 */
export class FunctionCall extends Expression {
    public callee: Expression;
    public paren: Token;
    public args: Expression[];

    constructor(callee: Expression, paren: Token, args: Expression[]) {
        super();
        this.callee = callee;
        this.paren = paren;
        this.args = args;
    }
}

/**
 * A function expression
 */
export class CallExpression extends Expression {
    public callee: Expression;
    public paren: Token;
    public args: Expression[];

    constructor(callee: Expression, paren: Token, args: Expression[]) {
        super();
        this.callee = callee;
        this.paren = paren;
        this.args = args;
    }

    public toString(): string {
        return `CallExpression { callee: ${this.callee}, paren: ${this.paren}, args: ${this.args} }`;
    }
}

/**
 * Represents a logical operator like `and` or `or`.
 */
export class LogicalExpression extends Expression {
    public left: Expression;
    public operator: Token;
    public right: Expression;

    constructor(left: Expression, operator: Token, right: Expression) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}