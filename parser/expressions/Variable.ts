import { Expression } from "./Expression";
import { Token } from "../../scanner/Token";

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