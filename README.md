# Cosmo Interpreter 🚀✨

Cosmo is the interpreter absolutely no one asked for, but I built it anyway! Crafted from scratch, Cosmo was my grand adventure into the mysterious realm of interpreter design and programming language implementation. Does it serve a practical purpose? Absolutely not. But creating Cosmo was a blast and taught me more about interpreters than I ever thought I'd know.

Why I chose TypeScript is beyond me, but here we are, lmao!

## Features
- Custom Syntax: Cosmo utilizes a unique syntax that I designed, supporting basic computational operations.
- Lexer and Parser: Implements a basic lexer and parser to process the custom language syntax.
- Execution Engine: Interprets parsed code and executes instructions accordingly.

## Conclusion
Cosmo may not revolutionize technology as we know it, but it sure made my coding journey more interesting. It's proof that with a bit of determination (and a disregard for sanity), you can create something uniquely your own—even if it serves absolutely no practical purpose.

## Grammar (EBNF)
Below is the EBNF tree of the Cosmo Interpreter

```markdown
(* Program Structure *)
program             ::= { declaration };

(* Declarations *)
declaration         ::= variable_declaration
                      | function_declaration
                      | statement;

variable_declaration ::= "create" identifier [ "=" expression ] ";";

function_declaration ::= "func" identifier "(" [ parameter_list ] ")" block;

parameter_list      ::= identifier { "," identifier };

(* Statements *)
statement           ::= expression_statement
                      | output_statement
                      | if_statement
                      | while_statement
                      | for_statement
                      | return_statement
                      | block;

expression_statement ::= expression ";";

output_statement ::= 'output' '(' expression ')' ';'

if_statement        ::= "if" "(" expression ")" block [ "else" block ];

while_statement     ::= "while" "(" expression ")" block;

for_statement       ::= "for" "(" [ for_initializer ] ";" [ expression ] ";" [ expression ] ")" block;

return_statement    ::= "return" [ expression ] ";";

block               ::= "{" { declaration } "}";

(* For Loop Initializer *)
for_initializer     ::= variable_declaration
                      | expression_statement
                      | /* empty */;

(* Expressions *)
expression          ::= assignment;

assignment          ::= logical_or [ "=" assignment ];

logical_or          ::= logical_and { "or" logical_and };

logical_and         ::= equality { "and" equality };

equality            ::= comparison { ( "==" | "!=" ) comparison };

comparison          ::= term { ( ">" | ">=" | "<" | "<=" ) term };

term                ::= factor { ( "+" | "-" ) factor };

factor              ::= unary { ( "*" | "/" | "%" ) unary };

unary               ::= ( "-" | "not" | "!" ) unary
                      | call;

call                ::= primary { "(" [ argument_list ] ")" };

argument_list       ::= expression { "," expression };

primary             ::= identifier
                      | number
                      | string
                      | "true"
                      | "false"
                      | "null"
                      | "(" expression ")";

(* Tokens *)
identifier          ::= IDENTIFIER;
number              ::= NUMBER;
string              ::= STRING;

(* Lexical Tokens (defined by the lexer/scanner) *)
IDENTIFIER          ::= /[a-zA-Z_][a-zA-Z0-9_]*/;
NUMBER              ::= /[0-9]+(\.[0-9]+)?/;
STRING              ::= /"([^"\\]|\\.)*"/;

(* Reserved Keywords *)
reserved_keywords   ::= "create" | "func" | "return" | "if" | "else" | "while" | "for"
                      | "output" | "true" | "false" | "null" | "and" | "or" | "not";
```