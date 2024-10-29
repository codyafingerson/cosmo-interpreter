import { Callable } from './Callable';
import { Interpreter } from './Interpreter';

/**
 * The internal to Cosmo add function that is used to add two numbers.
 */
export class AddFunction extends Callable {
    public arity(): number {
        return 2;
    }

    public call(interpreter: Interpreter, args: any[]): any {
        const a = args[0];
        const b = args[1];

        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error("Arguments to 'add' must be numbers.");
        }
        
        return a + b;
    }

    public toString(): string {
        return "<native fn add>";
    }
}

/**
 * The internal to Cosmo square root function that is used to calculate the square root of a number.
 */
export class SquareRootFunction extends Callable {
    public arity(): number {
        return 1; // Currently, only one argument is supported.
    }

    public call(interpreter: Interpreter, args: any[]): any {
        const a = args[0]; // Get the argument of the function.
        if (typeof a !== 'number') {
            throw new Error("Argument to 'sqrt' must be a number.");
        }

        return Math.sqrt(a);
    }

    public toString(): string {
        return "<native fn sqrt>";
    }
}
