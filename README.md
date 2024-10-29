# Cosmo Interpreter

Cosmo is a simple interpreter that I developed from scratch as a personal learning project. Built without following any tutorials, Cosmo was my exploration into the fundamentals of interpreter design and programming language implementation. While it doesn't serve a specific practical purpose, creating Cosmo was a fun and educational experience that deepened my understanding of how interpreters work under the hood.

## Features
- Custom Syntax: Cosmo utilizes a unique syntax that I designed, supporting basic computational operations.
- Lexer and Parser: Implements a basic lexer and parser to process the custom language syntax.
- Execution Engine: Interprets parsed code and executes instructions accordingly.

## Getting Started
1. Clone the Repository: Download or clone the Cosmo repository to your local machine.

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

output_statement    ::= "output" expression ";";

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