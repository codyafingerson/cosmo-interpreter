import { Scanner } from "./scanner/Scanner";
import { Parser } from "./parser/Parser";
import { Interpreter } from "./interpreter/Interpreter";

const sourceCode = `
    

`

const scanner = new Scanner(sourceCode);
const tokens = scanner.scanTokens();

const parser = new Parser(tokens);
const statements = parser.parse();

const interpreter = new Interpreter();
interpreter.interpret(statements);