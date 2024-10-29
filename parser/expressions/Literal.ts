import { Expression } from "./Expression";

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