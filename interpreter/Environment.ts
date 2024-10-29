import type { Token } from "../scanner/Token";

/**
 * The environment class is used to store variables and their values.
 */
export class Environment {
    private values: Map<string, any> = new Map();

    constructor(private enclosing: Environment | null = null) {}

    /**
     * Defines a variable in the environment.
     * @param name the name of the variable
     * @param value the value associated with the variable
     */
    public define(name: string, value: any): void {
        this.values.set(name, value);
    }

    /**
     * Retrieves the value of a variable from the environment.
     * @param name the name of the variable
     * @returns the value of the variable
     */
    public get(name: Token): any {
        if (this.values.has(name.lexeme)) {
            return this.values.get(name.lexeme);
        } else if (this.enclosing !== null) {
            return this.enclosing.get(name);
        } else {
            throw new Error(`Undefined variable '${name.lexeme}'.`);
        }
    }

    /**
     * Assigns a value to a variable in the environment.
     * @param name the name of the variable
     * @param value the value to assign to the variable
     */
    public assign(name: Token, value: any): void {
        if (this.values.has(name.lexeme)) {
            this.values.set(name.lexeme, value);
        } else if (this.enclosing !== null) {
            this.enclosing.assign(name, value);
        } else {
            throw new Error(`Undefined variable '${name.lexeme}'.`);
        }
    }
}
