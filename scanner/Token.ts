export enum TokenType {
    LEFT_PAREN = 'Left Parenthesis', 
    RIGHT_PAREN = 'Right Parenthesis', 
    LEFT_BRACE = 'Left Brace', 
    RIGHT_BRACE = 'Right Brace',
    COMMA = 'Comma', 
    DOT = 'Dot', 
    MINUS = 'Minus', 
    PLUS = 'Plus', 
    SEMICOLON = 'Semicolon', 
    SLASH = 'Slash', 
    STAR = 'Star',
    
    BANG = 'Bang', 
    BANG_EQUAL = 'Bang Equal',
    EQUAL = 'Equal', 
    EQUAL_EQUAL = 'Equal Equal',
    GREATER = 'Greater', 
    GREATER_EQUAL = 'Greater Equal',
    LESS = 'Less', 
    LESS_EQUAL = 'Less Equal',
    
    IDENTIFIER = 'Identifier',
    STRING = 'String',
    NUMBER = 'Number',
    BOOLEAN = 'Boolean',
    
    AND = 'And',
    ELSE = 'Else',
    FALSE = 'False',
    FUNC = 'Function',
    FOR = 'For',
    IF = 'If',
    NIL = 'Nil',
    OR = 'Or',
    OUTPUT = 'Output',
    RETURN = 'Return',
    TRUE = 'True',
    CREATE = 'Create',
    WHILE = 'While',
    
    EOF = 'End of File'
}

export class Token {
    type: TokenType;
    lexeme: string;
    literal: any;
    line: number;

    constructor(type: TokenType, lexeme: string, literal: any, line: number) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    toString(): string {
        return `${this.type} ${this.lexeme} ${this.literal}`;
    }
}