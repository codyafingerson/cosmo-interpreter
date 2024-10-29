// FunctionObject.ts
import { Callable } from './Callable';
import { FunctionStatement } from '../parser/Statement';
import { Environment } from './Environment';
import { Interpreter } from './Interpreter';

/**
 * Represents a function object that can be called.
 */
export class FunctionObject extends Callable {
    private declaration: FunctionStatement;
    private closure: Environment;

    constructor(declaration: FunctionStatement, closure: Environment) {
        super();
        this.declaration = declaration;
        this.closure = closure;
    }

    public arity(): number {
        return this.declaration.params.length;
    }

    public call(interpreter: Interpreter, args: any[]): any {
        const environment = new Environment(this.closure);
        for (let i = 0; i < this.declaration.params.length; i++) {
            environment.define(this.declaration.params[i].lexeme, args[i]);
        }

        try {
            interpreter.executeBlock(this.declaration.body, environment); // Execute the function body
        } catch (returnValue) {
            if (returnValue instanceof ReturnException) {
                return returnValue.value;
            } else {
                throw returnValue;
            }
        }
        return null;
    }

    public toString(): string {
        return `<fn ${this.declaration.name.lexeme}>`;
    }
}


/**
 * Represents a return exception that is thrown when a return statement is encountered.
 */
export class ReturnException {
    constructor(public value: any) {}
}