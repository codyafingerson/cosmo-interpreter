import type { Token } from "../../scanner/Token";
import { Expression } from "./Expression";

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