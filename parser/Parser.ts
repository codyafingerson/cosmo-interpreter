import { Token, TokenType } from "../scanner/Token";
import { Expression, Assign, Binary, Grouping, Literal, Variable, Unary, CallExpression, LogicalExpression } from "./Expression";
import { Statement, OutputStatement, IfStatement, ExpressionStatement, CreateStatement, BlockStatement, FunctionStatement, ReturnStatement, WhileStatement } from "./Statement";

/**
 * The Cosmo interpreter parser class
 */
export class Parser {
    private tokens: Token[];
    private current: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    /**
     * Parses the tokens into statements
     * @returns {Statement[]} The parsed statements
     */
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
            if (this.match(TokenType.FUNC)) {
                return this.functionDeclaration("function");
            }
            return this.statement();
        } catch (error) {
            this.synchronize();
            return null;
        }
    }

    private functionDeclaration(kind: string): FunctionStatement {
        const name = this.consume(TokenType.IDENTIFIER, `Expect ${kind} name.`);
        this.consume(TokenType.LEFT_PAREN, `Expect '(' after ${kind} name.`);
        const parameters: Token[] = [];
        if (!this.check(TokenType.RIGHT_PAREN)) {
            // Parse parameters list if there are any
            do {
                if (parameters.length >= 255) {
                    console.error("Cannot have more than 255 parameters.");
                }
                parameters.push(
                    this.consume(TokenType.IDENTIFIER, "Expect parameter name.")
                );
            } while (this.match(TokenType.COMMA));
        }
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after parameters.");
    
        this.consume(TokenType.LEFT_BRACE, `Expect '{' before ${kind} body.`);
        const body = this.block();
        return new FunctionStatement(name, parameters, body);
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
        if (this.match(TokenType.FOR)) return this.forStatement();
        if (this.match(TokenType.IF)) return this.ifStatement();
        if (this.match(TokenType.WHILE)) return this.whileStatement();
        if (this.match(TokenType.OUTPUT)) return this.outputStatement();
        if (this.match(TokenType.RETURN)) return this.returnStatement();
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

    private forStatement(): Statement {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");
    
        let initializer: Statement | null;
        if (this.match(TokenType.SEMICOLON)) {
            initializer = null;
        } else if (this.match(TokenType.CREATE)) {
            initializer = this.varDeclaration();
        } else {
            initializer = this.expressionStatement();
        }
    
        let condition: Expression | null = null;
        if (!this.check(TokenType.SEMICOLON)) {
            condition = this.expression();
        }
        this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");
    
        let increment: Expression | null = null;
        if (!this.check(TokenType.RIGHT_PAREN)) {
            increment = this.expression();
        }
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");
    
        const body = this.statement();
    
        // Desugar the 'for' loop into a 'while' loop
        // Create a new block to hold the loop body and the increment
        let loopBody = body;
        if (increment !== null) {
            loopBody = new BlockStatement([
                loopBody,
                new ExpressionStatement(increment)
            ]);
        }
    
        if (condition === null) {
            condition = new Literal(true);
        }
        loopBody = new WhileStatement(condition, loopBody);
    
        // Wrap the initializer and the loop in a new block
        if (initializer !== null) {
            // Instead of creating a new block, we include the loop in the same block as the initializer
            return new BlockStatement([initializer, loopBody]);
        }
    
        // If there's no initializer, return the loop directly
        return loopBody;
    }
    
    private whileStatement(): Statement {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
        const condition = this.expression();
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");
        const body = this.statement();
        return new WhileStatement(condition, body);
    }    

    private outputStatement(): Statement {
        const value = this.expression();
        this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
        return new OutputStatement(value);
    }

    private returnStatement(): Statement {
        const keyword = this.previous();
        let value: Expression | null = null;
        if (!this.check(TokenType.SEMICOLON)) {
            value = this.expression();
        }
        this.consume(TokenType.SEMICOLON, "Expect ';' after return value.");
        return new ReturnStatement(keyword, value);
    }

    private logicOr(): Expression {
        let expr = this.logicAnd();
    
        while (this.match(TokenType.OR)) {
            const operator = this.previous();
            const right = this.logicAnd();
            expr = new LogicalExpression(expr, operator, right);
        }
    
        return expr;
    }
    
    private logicAnd(): Expression {
        let expr = this.equality();
    
        while (this.match(TokenType.AND)) {
            const operator = this.previous();
            const right = this.equality();
            expr = new LogicalExpression(expr, operator, right);
        }
    
        return expr;
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
        const expr = this.logicOr();
    
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
            return this.finishCall(new Variable(this.previous()));
        }
    
        if (this.match(TokenType.LEFT_PAREN)) {
            const expr = this.expression();
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
            return new Grouping(expr);
        }
    
        console.error(`Expect expression at line ${this.peek().line}`);
        throw new Error("Expect expression.");
    }

    private finishCall(callee: Expression): Expression {
        if (!this.match(TokenType.LEFT_PAREN)) {
            return callee;
        }
    
        const args: Expression[] = [];
    
        if (!this.check(TokenType.RIGHT_PAREN)) {
            do {
                if (args.length >= 255) {
                    console.error("Can't have more than 255 arguments.");
                }
                args.push(this.expression());
            } while (this.match(TokenType.COMMA));
        }
    
        const paren = this.consume(TokenType.RIGHT_PAREN, "Expect ')' after arguments.");
    
        callee = new CallExpression(callee, paren, args);
        return this.finishCall(callee);
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