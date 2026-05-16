
/**
 * @param input - The input string to be converted to snake_case.
 * @returns The converted snake_case string.
 */


function toSnakeCase(input: string) {
  const output = input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w_]/g, "-");
   
  return output;
}

export default toSnakeCase;