import { parseArgs } from "util";
import fs from 'fs/promises';
import path from 'path';
import { Interpreter } from './interpreter/Interpreter';
import { Parser } from './parser/Parser';
import { Scanner } from './scanner/Scanner';

interface ParsedArgs {
  file: string;
}

function getParsedArgs(): ParsedArgs {
  const { values } = parseArgs({
    args: Bun.argv,
    options: {
      file: {
        type: 'string',
      },
    },
    strict: true,
    allowPositionals: true,
  });

  if (!values.file) {
    process.exit(1);
  }

  return { file: values.file };
}

async function readFileContent(filePath: string): Promise<string> {
  try {
    const resolvedPath = path.resolve(process.cwd(), filePath);
    await fs.access(resolvedPath);
    return await fs.readFile(resolvedPath, 'utf-8');
  } catch (error) {
    process.exit(1);
  }
}

async function runInterpreter(filePath: string): Promise<void> {
  const source = await readFileContent(filePath);

  const scanner = new Scanner(source);
  const tokens = scanner.scanTokens();

  const parser = new Parser(tokens);
  const statements = parser.parse();

  const interpreter = new Interpreter();
  interpreter.interpret(statements);
}

async function main() {
  const args = getParsedArgs();
  await runInterpreter(args.file);
}

main().catch(error => {
  process.exit(1);
});