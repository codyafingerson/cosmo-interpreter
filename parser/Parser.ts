import { Token, TokenType } from "../scanner/Token";
import { Expression, Assign, Binary, Grouping, Literal, Variable, Unary } from "./Expression";
import { Statement, OutputStatement, IfStatement, ExpressionStatement, CreateStatement, BlockStatement } from "./Statement";

export class Parser {
    private tokens: Token[];
    private current: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    public parse(): Statement[] {
        const statements: Statement[] = [];
        while (!this.isAtEnd()) {
            const decl = this.declaration();
            if (decl !== null) {
                statements.push(decl);
            }
        }
        return statements;
    }

    private declaration(): Statement | null {
        try {
            if (this.match(TokenType.CREATE)) {
                return this.varDeclaration();
            }
            return this.statement();
        } catch (error) {
            this.synchronize();
            return null;
        }
    }

    private varDeclaration(): Statement {
        const name = this.consume(TokenType.IDENTIFIER, "Expect variable name.");

        let initializer: Expression | null = null;
        if (this.match(TokenType.EQUAL)) {
            initializer = this.expression();
        }

        this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");
        return new CreateStatement(name, initializer);
    }

    private statement(): Statement {
        if (this.match(TokenType.IF)) return this.ifStatement();
        if (this.match(TokenType.OUTPUT)) return this.outputStatement();
        if (this.match(TokenType.LEFT_BRACE)) return new BlockStatement(this.block());
        return this.expressionStatement();
    }

    private ifStatement(): Statement {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
        const condition = this.expression();
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after if condition.");

        const thenBranch = this.statement();
        let elseBranch: Statement | null = null;
        if (this.match(TokenType.ELSE)) {
            elseBranch = this.statement();
        }

        return new IfStatement(condition, thenBranch, elseBranch);
    }

    private outputStatement(): Statement {
        const value = this.expression();
        this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
        return new OutputStatement(value);
    }

    private block(): Statement[] {
        const statements: Statement[] = [];

        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            const decl = this.declaration();
            if (decl !== null) {
                statements.push(decl);
            }
        }

        this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
        return statements;
    }

    private expressionStatement(): Statement {
        const expr = this.expression();
        this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
        return new ExpressionStatement(expr);
    }

    private expression(): Expression {
        return this.assignment();
    }

    private assignment(): Expression {
        const expr = this.equality();

        if (this.match(TokenType.EQUAL)) {
            const equals = this.previous();
            const value = this.assignment();

            if (expr instanceof Variable) {
                const name = expr.name;
                return new Assign(name, value);
            }

            console.error("Invalid assignment target.");
        }

        return expr;
    }

    private equality(): Expression {
        let expr = this.comparison();

        while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
            const operator = this.previous();
            const right = this.comparison();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    private comparison(): Expression {
        let expr = this.term();

        while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
            const operator = this.previous();
            const right = this.term();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    private term(): Expression {
        let expr = this.factor();

        while (this.match(TokenType.MINUS, TokenType.PLUS)) {
            const operator = this.previous();
            const right = this.factor();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    private factor(): Expression {
        let expr = this.unary();

        while (this.match(TokenType.SLASH, TokenType.STAR)) {
            const operator = this.previous();
            const right = this.unary();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    private unary(): Expression {
        if (this.match(TokenType.BANG, TokenType.MINUS)) {
            const operator = this.previous();
            const right = this.unary();
            return new Unary(operator, right);
        }

        return this.primary();
    }

    private primary(): Expression {
        if (this.match(TokenType.FALSE)) return new Literal(false);
        if (this.match(TokenType.TRUE)) return new Literal(true);
        if (this.match(TokenType.NIL)) return new Literal(null);

        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            return new Literal(this.previous().literal);
        }

        if (this.match(TokenType.IDENTIFIER)) {
            return new Variable(this.previous());
        }

        if (this.match(TokenType.LEFT_PAREN)) {
            const expr = this.expression();
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
            return new Grouping(expr);
        }

        console.error(`Expect expression at line ${this.peek().line}`);
        throw new Error("Expect expression.");
    }

    // Utility methods
    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance();
        console.error(message + ` at line ${this.peek().line}`);
        throw new Error(message);
    }

    private check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private isAtEnd(): boolean {
        return this.peek().type === TokenType.EOF;
    }

    private peek(): Token {
        return this.tokens[this.current];
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    private synchronize(): void {
        this.advance();

        while (!this.isAtEnd()) {
            if (this.previous().type === TokenType.SEMICOLON) return;

            switch (this.peek().type) {
                case TokenType.FUNC:
                case TokenType.CREATE:
                case TokenType.FOR:
                case TokenType.IF:
                case TokenType.WHILE:
                case TokenType.OUTPUT:
                case TokenType.RETURN:
                    return;
            }

            this.advance();
        }
    }
}
