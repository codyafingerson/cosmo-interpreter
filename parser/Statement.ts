import type { Token } from "../scanner/Token";
import { Expression } from "./Expression";

export abstract class Statement {}

export class OutputStatement extends Statement {
    public expression: Expression;

    constructor(expression: Expression) {
        super();
        this.expression = expression;
    }

    public toString(): string {
        return `OutputStatement { expression: ${this.expression} }`;
    }
}

export class IfStatement extends Statement {
    public condition: Expression;
    public thenBranch: Statement;
    public elseBranch: Statement | null;

    constructor(condition: Expression, thenBranch: Statement, elseBranch: Statement | null) {
        super();

        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }

    public toString(): string {
        return `IfStatement { condition: ${this.condition}, thenBranch: ${this.thenBranch}, elseBranch: ${this.elseBranch} }`;
    }
}

export class ExpressionStatement extends Statement {
    public expression: any;

    constructor(expression: any) {
        super();
        this.expression = expression;
    }
}

export class CreateStatement extends Statement {
    public name: Token;
    public initializer: Expression | null;

    constructor(name: Token, initializer: Expression | null) { 
        super();
        this.name = name;
        this.initializer = initializer;
    }

    public toString(): string {
        return `CreateStatement { name: ${this.name}, initializer: ${this.initializer} }`;
    }
}

export class BlockStatement extends Statement {
    public statements: Statement[];

    constructor(statements: Statement[]) {
        super();
        this.statements = statements;
    }

    public toString(): string {
        return `BlockStatement { statements: ${this.statements} }`;
    }
}