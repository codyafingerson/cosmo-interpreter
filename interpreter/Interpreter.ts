import { Token, TokenType } from "../scanner/Token";
import {
    Expression,
    Assign,
    Binary,
    Grouping,
    Literal,
    Unary,
    Variable,
    CallExpression,
    LogicalExpression
} from "../parser/Expression";
import {
    Statement,
    OutputStatement,
    IfStatement,
    ExpressionStatement,
    CreateStatement,
    BlockStatement,
    FunctionStatement,
    ReturnStatement,
    WhileStatement
} from "../parser/Statement";
import { Callable } from "./Callable";
import { Environment } from "./Environment";
import { FunctionObject, ReturnException } from "./FunctionObject";
import { AddFunction, SquareRootFunction } from "./StandardLib";

/**
 * The CosmoInterpreter class.
 * @description
 * This class handles the interpretation and execution of parsed statements and expressions.
 * As the final stage in the language processing pipeline, it ensures the code runs as intended.
 */
export class Interpreter {
    private globals: Environment = new Environment();
    private environment: Environment = this.globals;

    constructor() {
        // Define standard library functions here.
        // This is where the functions will actually be added to the source code and make them available and callable.
        this.globals.define('add', new AddFunction());
        this.globals.define('sqrt', new SquareRootFunction());
    }

    /**
     * Interprets the given statements.
     * @param statements The statements to interpret.
     */
    public interpret(statements: Statement[]): void {
        try {
            for (const statement of statements) {
                this.execute(statement);
            }
        } catch (error) {
            console.error("Runtime error: ", error);
        }
    }

    /**
     * Executes a block of statements within the given environment.
     * @param {Statement[]} statements
     * @param {Environment} environment
     */
    public executeBlock(statements: Statement[], environment: Environment): void {
        const previous = this.environment;

        // Using a try/finally clause to ensure the environment is restored even if an error occurs.
        try {
            this.environment = environment;
    
            for (const statement of statements) {
                this.execute(statement);
            }
        } finally {
            this.environment = previous;
        }
    } 

    // The execute method is the heart of the interpreter.
    private execute(stmt: Statement): void {
        if (stmt instanceof ExpressionStatement) {
            this.evaluate(stmt.expression);
        } else if (stmt instanceof OutputStatement) {
            const value = this.evaluate(stmt.expression);
            console.log(this.stringify(value));
        } else if (stmt instanceof CreateStatement) {
            let value = null;
            
            if (stmt.initializer !== null) {
                value = this.evaluate(stmt.initializer);
            }

            this.environment.define(stmt.name.lexeme, value);
        } else if (stmt instanceof BlockStatement) {
            this.executeBlock(stmt.statements, new Environment(this.environment));
        } else if (stmt instanceof IfStatement) {
            this.executeIf(stmt);
        } else if (stmt instanceof WhileStatement) {
            this.executeWhile(stmt);
        } else if (stmt instanceof FunctionStatement) {
            const functionObj = new FunctionObject(stmt, this.environment);
            this.environment.define(stmt.name.lexeme, functionObj);
        } else if (stmt instanceof ReturnStatement) {
            let value = null;

            if (stmt.value !== null) {
                value = this.evaluate(stmt.value);
            }

            throw new ReturnException(value);
        } else {
            throw new Error(`Unknown statement type: ${stmt.constructor.name}`);
        }
    }
    
    private evaluate(expr: Expression): any {
        if (expr instanceof Literal) {
            return expr.value;
        } else if (expr instanceof Grouping) {
            return this.evaluate(expr.expression);
        } else if (expr instanceof Unary) {
            const right = this.evaluate(expr.right);

            switch (expr.operator.type) {
                case TokenType.MINUS:
                    this.checkNumberOperand(expr.operator, right);
                    return -Number(right);
                case TokenType.BANG:
                    return !this.isTruthy(right);
            }
        } else if (expr instanceof Binary) {
            const left = this.evaluate(expr.left);
            const right = this.evaluate(expr.right);
    
            switch (expr.operator.type) {
                case TokenType.PLUS:
                    if (typeof left === 'number' && typeof right === 'number') {
                        return left + right;
                    }
                    if (typeof left === 'string' || typeof right === 'string') {
                        return this.stringify(left) + this.stringify(right);
                    }

                    throw new Error("Operands must be two numbers or strings.");
                case TokenType.MINUS:
                    this.checkNumberOperands(expr.operator, left, right);
                    return left - right;
                case TokenType.STAR:
                    this.checkNumberOperands(expr.operator, left, right);
                    return left * right;
                case TokenType.SLASH:
                    this.checkNumberOperands(expr.operator, left, right);
                    
                    if (right === 0) {
                        throw new Error("Division by zero.");
                    }

                    return left / right;
                case TokenType.GREATER:
                    this.checkNumberOperands(expr.operator, left, right);
                    return left > right;
                case TokenType.GREATER_EQUAL:
                    this.checkNumberOperands(expr.operator, left, right);
                    return left >= right;
                case TokenType.LESS:
                    this.checkNumberOperands(expr.operator, left, right);
                    return left < right;
                case TokenType.LESS_EQUAL:
                    this.checkNumberOperands(expr.operator, left, right);
                    return left <= right;
                case TokenType.EQUAL_EQUAL:
                    return this.isEqual(left, right);
                case TokenType.BANG_EQUAL:
                    return !this.isEqual(left, right);
                default:
                    throw new Error(`Unknown binary operator: ${expr.operator.type}`);
            }
        } else if (expr instanceof Variable) {
            return this.lookUpVariable(expr.name);
        } else if (expr instanceof Assign) {
            const value = this.evaluate(expr.value);
            this.environment.assign(expr.name, value);
            return value;
        } else if (expr instanceof CallExpression) {
            const callee = this.evaluate(expr.callee);
            const args: any[] = [];

            // Evaluate the arguments before calling the function.
            for (const argument of expr.args) {
                args.push(this.evaluate(argument));
            }
            
            // Ensure the callee is a callable object.
            if (!(callee instanceof Callable)) {
                throw new Error("Can only call functions and classes.");
            }
            
            const func = callee;
            if (args.length !== func.arity()) {
                throw new Error(`Expected ${func.arity()} arguments but got ${args.length}.`);
            }
    
            return func.call(this, args);
        } else if (expr instanceof LogicalExpression) {
            return this.evaluateLogical(expr);
        } else {
            throw new Error(`Unknown expression type: ${expr.constructor.name}`);
        }
    }   

    private evaluateLogical(expr: LogicalExpression): any {
        const left = this.evaluate(expr.left);
    
        if (expr.operator.type === TokenType.OR) {
            if (this.isTruthy(left)) {
                return left;
            } else {
                return this.evaluate(expr.right);
            }
        } else if (expr.operator.type === TokenType.AND) {
            if (!this.isTruthy(left)) {
                return left;
            } else {
                return this.evaluate(expr.right);
            }
        } else {
            throw new Error(`Unknown logical operator: ${expr.operator.type}`);
        }
    }

    private executeWhile(stmt: WhileStatement): void {
        try {
            while (this.isTruthy(this.evaluate(stmt.condition))) {
                try {
                    this.execute(stmt.body);
                } catch (error) {
                    throw error;
                }
            }
        } catch (error) {
            throw error;
        }
    }

    private executeIf(stmt: IfStatement): void {
        const condition = this.evaluate(stmt.condition);
        if (this.isTruthy(condition)) {
            this.execute(stmt.thenBranch);
        } else if (stmt.elseBranch !== null) {
            this.execute(stmt.elseBranch);
        }
    }

    private isTruthy(value: any): boolean {
        if (value === null) return false;
        if (typeof value === 'boolean') return value;

        return true;
    }

    private isEqual(a: any, b: any): boolean {
        if (a === null && b === null) return true;
        if (a === null) return false;

        return a === b;
    }

    private checkNumberOperand(operator: Token, operand: any): void {
        if (typeof operand === 'number') return;

        throw new Error(`Operand must be a number. Operator: '${operator.lexeme}'`);
    }

    private checkNumberOperands(operator: Token, left: any, right: any): void {
        if (typeof left === 'number' && typeof right === 'number') return;

        throw new Error(`Operands must be numbers. Operator: '${operator.lexeme}'`);
    }

    private lookUpVariable(name: Token): any {
        return this.environment.get(name);
    }    

    private stringify(value: any): string {
        if (value === null) return "nil";
        
        return String(value);
    }
}