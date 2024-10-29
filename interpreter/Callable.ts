import { Interpreter } from "./Interpreter";

/**
 * A callable object that can be invoked in the interpreter.
 * @abstract
 */
export abstract class Callable {
    /**
     * The number of arguments the function expects.
     */
    abstract arity(): number;

    /**
     * Invokes the function with the given arguments.
     * @param interpreter the interpreter instance
     * @param args the arguments to pass to the function
     */
    abstract call(interpreter: Interpreter, args: any[]): any;
}
