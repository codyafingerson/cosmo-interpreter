import type { Token } from "../scanner/Token";
import { Expression } from "./Expression";

/**
 * Represents a statement in the language.
 * @abstract
 */
export abstract class Statement {}

/**
 * Represents a function statement
 * 
 * @example
 * ```
 * function add(a, b) { 
 *  return a + b; 
 * }
 * ```
 */
export class FunctionStatement extends Statement {
    public name: Token;
    public params: Token[];
    public body: Statement[];

    constructor(name: Token, params: Token[], body: Statement[]) {
        super();
        this.name = name;
        this.params = params;
        this.body = body;
    }
}

/**
 * Represents a return statement, i.e: 
 * 
 * @example
 * ```
 * return 1;
 * ```
 */
export class ReturnStatement extends Statement {
    public keyword: Token;
    public value: Expression | null;

    constructor(keyword: Token, value: Expression | null) {
        super();
        this.keyword = keyword;
        this.value = value;
    }
}

/**
 * Represents an output statement that prints a value to the console.
 * 
 * @example
 * ```
 * output 1;
 * ```
 */
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

/**
 * Represents a print statement
 * 
 * @example
 * ```
 * if(true) {
 *  output 1;
 * }
 * ```
 */
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

/**
 * Expression statement
 * 
 * @example
 * ```
 * 1 + 2;
 * ```
 */
export class ExpressionStatement extends Statement {
    public expression: any;

    constructor(expression: any) {
        super();
        this.expression = expression;
    }
}

/**
 * Represents a variable declaration statement
 * 
 * @example
 * ```
 * create a = 1;
 * ```
 */
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

/**
 * Represents a block statement
 */
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

/**
 * Represents a while statement
 * 
 * @example
 * ```
 * while(true) {
 *  output 1;
 * }
 * ```
 */
export class WhileStatement extends Statement {
    public condition: Expression;
    public body: Statement;

    constructor(condition: Expression, body: Statement) {
        super();
        this.condition = condition;
        this.body = body;
    }
}