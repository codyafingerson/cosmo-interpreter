import type { Token } from "../scanner/Token";

export abstract class Expression {}

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