/**
 * Capitalizes the first character of a string and converts the remaining characters to lowercase.
 *
 * This function ensures that the input string starts with an uppercase letter, while the rest
 * of the string is transformed to lowercase. It is commonly used for formatting names, titles,
 * or user-facing labels to maintain consistent capitalization style.
 *
 * The function is generic over string literal types (`T`), returning a value typed as
 * `Capitalize<T>` for more precise compile-time inference when used with literal strings.
 *
 * @typeParam T - The input string literal type.
 * @param {T} str - The string to transform. If the input is empty, an empty string is returned.
 * @returns {Capitalize<T>} - A new string with the first character in uppercase and the rest in lowercase.
 *
 * @example
 * capitalize("hello");       // "Hello"
 * capitalize("hELLO");       // "Hello"
 * capitalize("javaScript");  // "Javascript"
 * capitalize("ßpecial");     // "Sspecial"
 * capitalize("");            // ""
 */
export function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() +
    str.slice(1).toLowerCase()) as Capitalize<T>;
}

export const CASE_SPLIT_PATTERN =
  /\p{Lu}?\p{Ll}+|[0-9]+|\p{Lu}+(?!\p{Ll})|\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{L}+/gu;
/**
 * Splits a string into an array of word-like segments using `CASE_SPLIT_PATTERN`.
 *
 * This function identifies meaningful word segments in a string by detecting boundaries
 * such as camelCase or PascalCase transitions, ALLCAPS sequences, numbers, emojis, and
 * other Unicode letters. It is particularly useful for preprocessing strings before
 * converting them into various naming conventions (e.g., camelCase, snake_case, kebab-case).
 *
 * If the input string is empty or contains no recognizable word segments, the function
 * returns an empty array.
 *
 * @param {string} str - The input string to split into word-like segments.
 * @returns {string[]} - An array of extracted words or segments from the input string.
 *
 * @example
 * words("helloWorld");          // ["hello", "World"]
 * words("HTTPRequest");         // ["HTTP", "Request"]
 * words("snake_case_example");  // ["snake", "case", "example"]
 * words("numbers123andText");   // ["numbers", "123", "and", "Text"]
 * words("emoji🔥Test");         // ["emoji", "🔥", "Test"]
 * words("");                    // []
 */
export function words(str: string): string[] {
  return Array.from(str.match(CASE_SPLIT_PATTERN) ?? []);
}

/**
 * Converts a given string into **camelCase** format.
 *
 * Camel case is a naming convention where the first word is written entirely in lowercase,
 * and each subsequent word begins with a capital letter, concatenated without spaces or
 * special characters. This style is commonly used in programming for naming variables,
 * functions, and object properties.
 *
 * The function automatically splits the input string into word-like segments (based on
 * capitalization, underscores, hyphens, whitespace, or other separators), lowercases
 * the first segment, and capitalizes each subsequent segment before joining them.
 *
 * If the input is empty or contains no valid word segments, an empty string is returned.
 *
 * @param {string} str - The input string to convert to camel case.
 * @returns {string} - A new string formatted in camel case.
 *
 * @example
 * camelCase("Hello world");        // "helloWorld"
 * camelCase("hello_world-test");   // "helloWorldTest"
 * camelCase("  multiple words ");  // "multipleWords"
 * camelCase("HTTPRequest");        // "httpRequest"
 * camelCase("Keep unicode 😅");    // "keepUnicode😅"
 */
export function camelCase(str: string): string {
  const wordList = words(str);

  if (wordList.length === 0) {
    return "";
  }

  const [first, ...rest] = wordList;

  return `${first.toLowerCase()}${rest
    .map((word) => capitalize(word))
    .join("")}`;
}

/**
 * Converts a given string into **CONSTANT_CASE** format.
 *
 * Constant case (also known as *screaming snake case*) is a naming convention where all
 * letters are uppercase and words are separated by underscores. It is commonly used for
 * defining constants or environment variable names in many programming languages.
 *
 * The function splits the input string into word-like segments (based on capitalization,
 * underscores, hyphens, whitespace, or other delimiters), converts each segment to uppercase,
 * and joins them with underscores.
 *
 * If the input string is empty or contains no recognizable segments, an empty string is returned.
 *
 * @param {string} str - The input string to be converted to constant case.
 * @returns {string} - A new string formatted in CONSTANT_CASE.
 *
 * @example
 * constantCase("Hello world");        // "HELLO_WORLD"
 * constantCase("helloWorld");         // "HELLO_WORLD"
 * constantCase("HTTPRequest");        // "HTTP_REQUEST"
 * constantCase("snake_case_text");    // "SNAKE_CASE_TEXT"
 * constantCase("keep unicode 😅");    // "KEEP_UNICODE_😅"
 * constantCase("");                   // ""
 */
export function constantCase(str: string): string {
  const wordList = words(str);
  return wordList.map((word) => word.toUpperCase()).join("_");
}

//#region Deburr Map
const deburrMap = new Map<string, string>(
  // eslint-disable-next-line no-restricted-syntax
  Object.entries({
    Æ: "Ae",
    Ð: "D",
    Ø: "O",
    Þ: "Th",
    ß: "ss",
    æ: "ae",
    ð: "d",
    ø: "o",
    þ: "th",
    Đ: "D",
    đ: "d",
    Ħ: "H",
    ħ: "h",
    ı: "i",
    Ĳ: "IJ",
    ĳ: "ij",
    ĸ: "k",
    Ŀ: "L",
    ŀ: "l",
    Ł: "L",
    ł: "l",
    ŉ: "'n",
    Ŋ: "N",
    ŋ: "n",
    Œ: "Oe",
    œ: "oe",
    Ŧ: "T",
    ŧ: "t",
    ſ: "s",
  }),
);
/**
 * Removes diacritical marks (accents) and converts special Latin characters
 * in a string to their basic ASCII equivalents.
 *
 * This process is known as **deburring** — it strips combining marks and replaces
 * accented characters (like “é” or “ñ”) with their unaccented counterparts (“e”, “n”).
 * It also normalizes the string using Unicode *Normalization Form D (NFD)* to ensure
 * consistency across different representations of accented characters.
 *
 * The function preserves non-Latin characters (e.g., emoji, Cyrillic, or Asian scripts)
 * and only targets Latin-based diacritics and special mappings defined in `deburrMap`.
 *
 * If the input string is empty or contains no accented characters, it is returned unchanged.
 *
 * @param {string} str - The input string to remove diacritical marks from.
 * @returns {string} - A new deburred string with accents and special marks removed.
 *
 * @example
 * deburr("déjà vu");             // "deja vu"
 * deburr("crème brûlée");        // "creme brulee"
 * deburr("mañana");              // "manana"
 * deburr("façade");              // "facade"
 * deburr("Đặng Văn Lâm");        // "Dang Van Lam"
 * deburr("smile 😅 café");       // "smile 😅 cafe"
 * deburr("");                    // ""
 */
export function deburr(str: string): string {
  str = str.normalize("NFD");

  let result = "";

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (
      (char >= "\u0300" && char <= "\u036f") ||
      (char >= "\ufe20" && char <= "\ufe23")
    ) {
      continue;
    }

    result += deburrMap.get(char) ?? char;
  }

  return result;
}

//#endregion

//#region escape
const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
/**
 * Escapes HTML special characters in a string to their corresponding HTML entities.
 *
 * This function replaces characters that have special meaning in HTML — such as
 * `&`, `<`, `>`, `"`, and `'` — with their safe HTML entity equivalents. This helps
 * prevent HTML injection or XSS vulnerabilities when rendering user-generated content
 * inside web pages.
 *
 * The replacements are based on a predefined `htmlEscapes` map, for example:
 * ```
 * {
 *   "&": "&amp;",
 *   "<": "&lt;",
 *   ">": "&gt;",
 *   "\"": "&quot;",
 *   "'": "&#39;"
 * }
 * ```
 *
 * If the input string does not contain any escapable characters, it is returned unchanged.
 *
 * @param {string} str - The input string that may contain HTML special characters.
 * @returns {string} - A new string with HTML special characters replaced by their escaped entities.
 *
 * @example
 * escape("Tom & Jerry");            // "Tom &amp; Jerry"
 * escape("<script>alert(1)</script>"); // "&lt;script&gt;alert(1)&lt;/script&gt;"
 * escape("5 > 3 and 2 < 4");        // "5 &gt; 3 and 2 &lt; 4"
 * escape('He said "Hello"');        // "He said &quot;Hello&quot;"
 * escape("It's great!");            // "It&#39;s great!"
 * escape("Safe text");              // "Safe text"
 */
export function escape(str: string): string {
  return str.replace(/[&<>"']/g, (match) => htmlEscapes[match]);
}
//#endregion

//#region kebabCase
/**
 * Converts a given string into **kebab-case** format.
 *
 * Kebab case is a naming convention where all letters are lowercase and words are
 * separated by hyphens (`-`). It is commonly used for CSS class names, URLs, or
 * identifiers in various programming contexts.
 *
 * The function splits the input string into word-like segments (based on capitalization,
 * underscores, hyphens, whitespace, or other delimiters), lowercases each segment,
 * and joins them with hyphens.
 *
 * If the input string is empty or contains no recognizable word segments, an empty string is returned.
 *
 * @param {string} str - The input string to convert to kebab case.
 * @returns {string} - A new string formatted in kebab-case.
 *
 * @example
 * kebabCase("Hello world");         // "hello-world"
 * kebabCase("helloWorld");          // "hello-world"
 * kebabCase("HTTPRequest");         // "http-request"
 * kebabCase("snake_case_text");     // "snake-case-text"
 * kebabCase("Keep unicode 😅");     // "keep-unicode-😅"
 * kebabCase("");                     // ""
 */
export function kebabCase(str: string): string {
  const wordList = words(str);
  return wordList.map((word) => word.toLowerCase()).join("-");
}
//#endregion

//#region lowerCase
/**
 * Converts a given string into **lowercase words** separated by spaces.
 *
 * This function splits the input string into word-like segments (based on capitalization,
 * underscores, hyphens, whitespace, or other delimiters), converts each segment to lowercase,
 * and joins them with single spaces. It is useful for normalizing strings for display
 * or comparison purposes.
 *
 * If the input string is empty or contains no recognizable word segments, an empty string is returned.
 *
 * @param {string} str - The input string to convert to lowercase words.
 * @returns {string} - A new string where all words are in lowercase and separated by spaces.
 *
 * @example
 * lowerCase("HelloWorld");         // "hello world"
 * lowerCase("HTTPRequest");        // "http request"
 * lowerCase("snake_case_text");    // "snake case text"
 * lowerCase("Keep unicode 😅");    // "keep unicode 😅"
 * lowerCase("");                    // ""
 */
export function lowerCase(str: string): string {
  const wordList = words(str);
  return wordList.map((word) => word.toLowerCase()).join(" ");
}

//#endregion

//#region lowerFirst
/**
 * Converts the first character of a string to lowercase, leaving the rest of the string unchanged.
 *
 * This function is useful for formatting strings where only the initial character needs to be
 * modified, such as when converting class names to variable names or adjusting titles.
 *
 * If the input string is empty, an empty string is returned.
 *
 * @param {string} str - The input string to transform.
 * @returns {string} - A new string with the first character in lowercase.
 *
 * @example
 * lowerFirst("Hello");       // "hello"
 * lowerFirst("HELLO");       // "hELLO"
 * lowerFirst("JavaScript");  // "javaScript"
 * lowerFirst("ßpecial");     // "ßpecial"
 * lowerFirst("");            // ""
 */
export function lowerFirst(str: string): string {
  return str.substring(0, 1).toLowerCase() + str.substring(1);
}
//#endregion

//#region pad
/**
 * Pads a string on both sides with a specified character until it reaches a desired total length.
 *
 * This function adds the specified padding character to the start and end of the input string
 * evenly. If the total padding required is odd, the extra character is added to the end of the string.
 * If the input string is already equal to or longer than the specified length, it is returned unchanged.
 *
 * @param {string} str - The input string to pad.
 * @param {number} length - The desired total length of the padded string.
 * @param {string} [char=' '] - The character to use for padding. Defaults to a space if not provided.
 * @returns {string} - A new string padded to the specified length.
 *
 * @example
 * pad("hello", 10);          // "  hello   "
 * pad("world", 12, "*");     // "***world****"
 * pad("pad", 5, "-");       // "-pad-"
 * pad("noPadding", 5);       // "noPadding"
 * pad("", 4, "+");           // "++++"
 */
export function pad(str: string, length: number, chars = " "): string {
  return str
    .padStart(Math.floor((length - str.length) / 2) + str.length, chars)
    .padEnd(length, chars);
}
//#endregion

//#region pascalCase
/**
 * Converts a given string into **PascalCase** format.
 *
 * Pascal case is a naming convention where each word in the string starts with an uppercase letter,
 * and all words are concatenated without spaces or special characters. This style is commonly used
 * for naming classes, types, and constructors in various programming languages.
 *
 * The function splits the input string into word-like segments (based on capitalization,
 * underscores, hyphens, whitespace, or other separators), capitalizes each segment,
 * and joins them together.
 *
 * If the input is empty or contains no valid word segments, an empty string is returned.
 *
 * @param {string} str - The input string to convert to Pascal case.
 * @returns {string} - A new string formatted in Pascal case.
 *
 * @example
 * pascalCase("hello world");        // "HelloWorld"
 * pascalCase("hello_world-test");   // "HelloWorldTest"
 * pascalCase("  multiple words ");  // "MultipleWords"
 * pascalCase("HTTPRequest");        // "HttpRequest"
 * pascalCase("Keep unicode 😅");    // "KeepUnicode😅"
 */
export function pascalCase(str: string): string {
  const wordList = words(str);
  return wordList.map((word) => capitalize(word)).join("");
}

//#region reverseString
/**
 * Reverses the characters in a given string.
 *
 * This function takes an input string and returns a new string with the characters
 * in reverse order. It correctly handles Unicode characters, including those represented
 * by surrogate pairs, ensuring that multi-byte characters are not split incorrectly.
 *
 * If the input string is empty, an empty string is returned.
 *
 * @param {string} value - The input string to reverse.
 * @returns {string} - A new string with the characters in reverse order.
 *
 * @example
 * reverseString("hello");          // "olleh"
 * reverseString("😀😃😄");         // "😄😃😀"
 * reverseString("ABC123");        // "321CBA"
 * reverseString("");               // ""
 */
export function reverseString(value: string): string {
  return [...value].reverse().join("");
}
//#endregion

//#region snakeCase
/**
 * Converts a given string into **snake_case** format.
 *
 * Snake case is a naming convention where all letters are lowercase and words are
 * separated by underscores (`_`). It is commonly used for variable names, function
 * names, and file names in various programming languages.
 *
 * The function splits the input string into word-like segments (based on capitalization,
 * underscores, hyphens, whitespace, or other delimiters), lowercases each segment,
 * and joins them with underscores.
 *
 * If the input string is empty or contains no recognizable word segments, an empty string is returned.
 *
 * @param {string} str - The input string to convert to snake case.
 * @returns {string} - A new string formatted in snake_case.
 *
 * @example
 * snakeCase("Hello world");         // "hello_world"
 * snakeCase("helloWorld");          // "hello_world"
 * snakeCase("HTTPRequest");         // "http_request"
 * snakeCase("kebab-case-text");     // "kebab_case_text"
 * snakeCase("Keep unicode 😅");     // "keep_unicode_😅"
 * snakeCase("");                     // ""
 */
export function snakeCase(str: string): string {
  const wordList = words(str);
  return wordList.map((word) => word.toLowerCase()).join("_");
}
//#endregion

//#region startCase
/**
 * Converts a given string into **Start Case** format.
 *
 * Start case is a naming convention where the first letter of each word is capitalized,
 * and words are separated by spaces. This style is often used for titles, headings,
 * or user-facing labels to enhance readability.
 *
 * The function splits the input string into word-like segments (based on capitalization,
 * underscores, hyphens, whitespace, or other delimiters), capitalizes each segment,
 * and joins them with spaces.
 *
 * If the input string is empty or contains no recognizable word segments, an empty string is returned.
 *
 * @param {string} str - The input string to convert to start case.
 * @returns {string} - A new string formatted in Start Case.
 *
 * @example
 * startCase("hello world");         // "Hello World"
 * startCase("helloWorld");          // "Hello World"
 * startCase("HTTPRequest");         // "Http Request"
 * startCase("snake_case_text");     // "Snake Case Text"
 * startCase("Keep unicode 😅");     // "Keep Unicode 😅"
 * startCase("");                     // ""
 */
export function startCase(str: string): string {
  const wordList = words(str.trim());
  let result = "";
  for (let i = 0; i < wordList.length; i++) {
    const word = wordList[i];
    if (result) {
      result += " ";
    }

    result += word[0].toUpperCase() + word.slice(1).toLowerCase();
  }
  return result;
}
//#endregion

//#region trimEnd
/**
 * Trims specified characters from the end of a string.
 *
 * This function removes all occurrences of the specified characters from the end of the input string.
 * If no characters are specified, it defaults to trimming whitespace characters. The trimming continues
 * until a character not in the specified set is encountered.
 *
 * @param {string} str - The input string to trim.
 * @param {string | string[]} [chars] - The character or array of characters to trim from the end of the string.
 *                                       If omitted, whitespace characters are trimmed.
 * @returns {string} - A new string with the specified characters trimmed from the end.
 *
 * @example
 * trimEnd("hello!!!", "!");          // "hello"
 * trimEnd("hello   ");               // "hello"
 * trimEnd("foobarxyz", ["x", "y", "z"]); // "foobar"
 * trimEnd("noTrimNeeded");           // "noTrimNeeded"
 */
export function trimEnd(str: string, chars?: string | string[]): string {
  if (chars === undefined) {
    return str.trimEnd();
  }

  let endIndex = str.length;

  switch (typeof chars) {
    case "string": {
      if (chars.length !== 1) {
        throw new Error(
          `The 'chars' parameter should be a single character string.`,
        );
      }

      while (endIndex > 0 && str[endIndex - 1] === chars) {
        endIndex--;
      }
      break;
    }
    case "object": {
      while (endIndex > 0 && chars.includes(str[endIndex - 1])) {
        endIndex--;
      }
    }
  }

  return str.substring(0, endIndex);
}
//#endregion

//#region trimStart
/**
 * Trims specified characters from the start of a string.
 * This function removes all occurrences of the specified characters from the beginning of the input string.
 * If no characters are specified, it defaults to trimming whitespace characters. The trimming continues
 * until a character not in the specified set is encountered.
 *
 * @param {string} str - The input string to trim.
 * @param {string | string[]} [chars] - The character or array of characters to trim from the start of the string.
 *                                       If omitted, whitespace characters are trimmed.
 * @returns {string} - A new string with the specified characters trimmed from the start.
 * @example
 * trimStart("!!!hello", "!");          // "hello"
 * trimStart("   hello   ");            // "hello   "
 * trimStart("xyzfoobar", ["x", "y", "z"]); // "foobar"
 * trimStart("noTrimNeeded");           // "noTrimNeeded"
 */
export function trimStart(str: string, chars?: string | string[]): string {
  if (chars === undefined) {
    return str.trimStart();
  }

  let startIndex = 0;

  switch (typeof chars) {
    case "string": {
      while (startIndex < str.length && str[startIndex] === chars) {
        startIndex++;
      }
      break;
    }
    case "object": {
      while (startIndex < str.length && chars.includes(str[startIndex])) {
        startIndex++;
      }
    }
  }

  return str.substring(startIndex);
}
//#endregion

//#region trim
/**
 * Trims specified characters from both ends of a string.
 * This function removes all occurrences of the specified characters from the beginning and end of the input string.
 * If no characters are specified, it defaults to trimming whitespace characters. The trimming continues
 * until a character not in the specified set is encountered on both ends.
 *
 * @param {string} str - The input string to trim.
 * @param {string | string[]} [chars] - The character or array of characters to trim from both ends of the string.
 *                                       If omitted, whitespace characters are trimmed.
 * @returns {string} - A new string with the specified characters trimmed from both ends.
 * @example
 * trim("!!!hello!!!", "!");          // "hello"
 * trim("   hello   ");               // "hello"
 * trim("xyzfoobarxyz", ["x", "y", "z"]); // "foobar"
 * trim("noTrimNeeded");              // "noTrimNeeded"
 */
export function trim(str: string, chars?: string | string[]): string {
  if (chars === undefined) {
    return str.trim();
  }

  return trimStart(trimEnd(str, chars), chars);
}

//#endregion

//#region upperCase
/**
 * Converts a given string into **UPPERCASE WORDS** separated by spaces.
 *
 * This function splits the input string into word-like segments (based on capitalization,
 * underscores, hyphens, whitespace, or other delimiters), converts each segment to uppercase,
 * and joins them with single spaces. It is useful for emphasizing text or formatting
 * strings for display.
 *
 * If the input string is empty or contains no recognizable word segments, an empty string is returned.
 *
 * @param {string} str - The input string to convert to uppercase words.
 * @returns {string} - A new string where all words are in uppercase and separated by spaces.
 *
 * @example
 * upperCase("HelloWorld");         // "HELLO WORLD"
 * upperCase("HTTPRequest");        // "HTTP REQUEST"
 * upperCase("snake_case_text");    // "SNAKE CASE TEXT"
 * upperCase("Keep unicode 😅");    // "KEEP UNICODE 😅"
 * upperCase("");                    // ""
 */
export function upperCase(str: string): string {
  const wordList = words(str);
  return wordList.map((word) => word.toUpperCase()).join(" ");
}
//#endregion

//#region upperFirst
/**
 * Converts the first character of a string to uppercase, leaving the rest of the string unchanged.
 *
 * This function is useful for formatting strings where only the initial character needs to be
 * modified, such as when converting variable names to class names or adjusting titles.
 *
 * If the input string is empty, an empty string is returned.
 *
 * @param {string} str - The input string to transform.
 * @returns {string} - A new string with the first character in uppercase.
 *
 * @example
 * upperFirst("hello");       // "Hello"
 * upperFirst("hELLO");       // "HELLO"
 * upperFirst("javaScript");  // "JavaScript"
 * upperFirst("ßpecial");     // "Sspecial"
 * upperFirst("");            // ""
 */
export function upperFirst(str: string): string {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}
//#endregion

//#region toSnakeCase
/**
 * Recursively converts the keys of an object or elements of an array to snake_case.
 *
 * This function traverses the input value, which can be an object, array, or primitive,
 * and converts all object keys to snake_case format. It handles nested objects and arrays
 * by applying the conversion recursively. Primitive values (strings, numbers, booleans, etc.)
 * are returned unchanged.
 *
 * If the input is `null` or `undefined`, it is returned as is. Date objects are also preserved
 * without modification.
 *
 * @param {any} value - The input value to convert (object, array, or primitive).
 * @returns {any} - A new value with all object keys converted to snake_case.
 *
 * @example
 * toSnakeCase({ firstName: "John", lastName: "Doe" });
 * // { first_name: "John", last_name: "Doe" }
 *
 * toSnakeCase([{ userName: "jdoe" }, { userName: "asmith" }]);
 * // [{ user_name: "jdoe" }, { user_name: "asmith" }]
 *
 * toSnakeCase({
 *   userDetails: {
 *     firstName: "Jane",
 *     addressList: [
 *       { streetName: "Main St", zipCode: "12345" }
 *     ]
 *   }
 * });
 * */
export function toSnakeCase(value: any): any {
  if (value === null || value === undefined || typeof value !== "object") {
    return value;
  }

  if (value instanceof Date) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(toSnakeCase);
  }

  return Object.keys(value).reduce(
    (acc, key) => {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();

      acc[snakeKey] = toSnakeCase(value[key]);

      return acc;
    },
    {} as Record<string, any>,
  );
}

//#endregion

//#region toCamelCase
/**
 * Recursively converts the keys of an object or elements of an array to camelCase.
 *
 * This function traverses the input value, which can be an object, array, or primitive,
 * and converts all object keys to camelCase format. It handles nested objects and arrays
 * by applying the conversion recursively. Primitive values (strings, numbers, booleans, etc.)
 * are returned unchanged.
 *
 * If the input is `null` or `undefined`, it is returned as is. Date objects are also preserved
 * without modification.
 *
 * @param {any} value - The input value to convert (object, array, or primitive).
 * @returns {any} - A new value with all object keys converted to camelCase.
 *
 * @example
 * toCamelCase({ first_name: "John", last_name: "Doe" });
 * // { firstName: "John", lastName: "Doe" }
 *
 * toCamelCase([{ user_name: "jdoe" }, { user_name: "asmith" }]);
 * // [{ userName: "jdoe" }, { userName: "asmith" }]
 *
 * toCamelCase({
 *   user_details: {
 *     first_name: "Jane",
 *     address_list: [
 *       { street_name: "Main St", zip_code: "12345" }
 *     ]
 *   }
 * });
 * */
export function toCamelCase(value: any): any {
  if (value === null || value === undefined || typeof value !== "object") {
    return value;
  }

  if (value instanceof Date) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(toCamelCase);
  }

  return Object.keys(value).reduce(
    (acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_: string, letter: string) =>
        letter.toUpperCase(),
      );

      acc[camelKey] = toCamelCase(value[key]);

      return acc;
    },
    {} as Record<string, any>,
  );
}

//#endregion

//#region
/**
 * A simple implementation of sprintf-style string formatting.
 *
 * This function replaces format specifiers in the input string with corresponding
 * argument values. It supports the following specifiers:
 * - `%s`: String
 * - `%d`: Number (integer or float)
 * - `%v`: Any value (converted to string)
 *
 * The function processes the format string and replaces each specifier with the
 * next argument provided. If there are more specifiers than arguments, the remaining
 * specifiers are left unchanged.
 *
 * @param {string} format - The format string containing specifiers.
 * @param {...any} args - The values to replace the specifiers in the format string.
 * @returns {string} - The formatted string with specifiers replaced by argument values.
 *
 * @example
 * sprintf("Hello, %s!", "World");          // "Hello, World!"
 * sprintf("You have %d new messages.", 5); // "You have 5 new messages."
 * sprintf("Value: %v", { key: "value" });  // "Value: [object Object]"
 */
export function sprintf(format: string, ...args: any[]): string {
  let i = 0;

  return format.replace(/%[sdv]/g, (_) => String(args[i++]));
}
//#endregion

//#region convertKeysWithBoth
/**
 * Recursively converts the keys of an object or elements of an array to both snake_case and camelCase.
 *
 * This function traverses the input value, which can be an object, array, or primitive,
 * and for each object key, it creates three versions: the original key, a snake_case version,
 * and a camelCase version. It handles nested objects and arrays by applying the conversion recursively.
 * Primitive values (strings, numbers, booleans, etc.) are returned unchanged.
 *
 * If the input is `null` or `undefined`, it is returned as is. Date objects are also preserved
 * without modification.
 *
 * @param {T | T[]} obj - The input value to convert (object, array, or primitive).
 * @returns {any} - A new value with all object keys converted to both snake_case and camelCase.
 *
 * @example
 * convertKeysWithBoth({ firstName: "John", lastName: "Doe" });
 * // {
 * //   firstName: "John",
 * //   first_name: "John",
 * //   FirstName: "John",
 * //   lastName: "Doe",
 * //   last_name: "Doe",
 * //   LastName: "Doe"
 * // }
 */
export function convertKeysWithBoth<T>(obj: T | T[]): any {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysWithBoth);
  } else if (obj !== null && typeof obj === "object") {
    const source = obj as any;
    return Object.keys(source).reduce(
      (acc, key) => {
        const camelKey = key.replace(/_([a-z])/g, (_: string, letter: string) =>
          letter.toUpperCase(),
        );
        const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();

        const value = source[key];

        acc[key] = value;
        acc[snakeKey] = value;
        acc[camelKey] = value;

        if (
          value !== null &&
          typeof value === "object" &&
          !(value instanceof Date)
        ) {
          const converted = convertKeysWithBoth(value);
          acc[key] = converted;
          acc[camelKey] = converted;
        }

        return acc;
      },
      {} as Record<string, any>,
    );
  }
  return obj;
}
//#endregion

//#region Lunar Calendar
/**
 * A date in the Vietnamese lunar calendar (âm lịch).
 */
export interface LunarDate {
  /** Day of the lunar month, from 1 to 30. */
  day: number;
  /** Month of the lunar year, from 1 to 12. */
  month: number;
  /** Lunar year. */
  year: number;
  /** Whether `month` is a leap month (tháng nhuận). */
  isLeapMonth: boolean;
}

/** Vietnam's reference timezone offset (GMT+7 / 105° East meridian) used by the lunar rules. */
const VN_TIMEZONE = 7;

function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;

  let jd =
    dd +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  if (jd < 2299161) {
    jd =
      dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }

  return jd;
}

function jdToDate(jd: number): [day: number, month: number, year: number] {
  let a: number;
  let b: number;
  let c: number;

  if (jd > 2299160) {
    a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((146097 * b) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }

  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = b * 100 + d - 4800 + Math.floor(m / 10);

  return [day, month, year];
}

// Julian day of the k-th new moon after the new moon of 1900-01-01.
function newMoon(k: number): number {
  const dr = Math.PI / 180;
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;

  let jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;

  let c1 =
    (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  c1 = c1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  c1 = c1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  c1 = c1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  c1 = c1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  c1 = c1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  c1 = c1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));

  const deltaT =
    T < -11
      ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2;

  return jd1 + c1 - deltaT;
}

// Sun's ecliptic longitude at Julian day `jdn`, expressed as a major-term index (0-11).
function sunLongitude(jdn: number): number {
  const dr = Math.PI / 180;
  const T = (jdn - 2451545) / 36525;
  const T2 = T * T;

  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;

  let dl = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  dl = dl + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);

  let l = (L0 + dl) * dr;
  l -= 2 * Math.PI * Math.floor(l / (2 * Math.PI));

  return Math.floor((l / Math.PI) * 6);
}

function getNewMoonDay(k: number, timeZone: number): number {
  return Math.floor(newMoon(k) + 0.5 + timeZone / 24);
}

function getSunLongitude(dayNumber: number, timeZone: number): number {
  return sunLongitude(dayNumber - 0.5 - timeZone / 24);
}

// Julian day marking the start of lunar month 11 (the month containing the winter solstice) of year `yy`.
function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  let k = Math.floor(off / 29.530588853);
  const nm = getNewMoonDay(k, timeZone);

  if (getSunLongitude(nm, timeZone) >= 9) {
    k--;
  }

  return getNewMoonDay(k, timeZone);
}

// Index (0-based, relative to month 11 of `a11`) of the leap month in a 13-month lunar year.
function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);

  let last = getSunLongitude(getNewMoonDay(k + 1, timeZone), timeZone);
  let i = 1;
  let arc = last;

  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);

  return i - 1;
}

/**
 * Converts a solar (Gregorian) date into its corresponding Vietnamese lunar calendar
 * (âm lịch) date.
 *
 * The conversion follows the standard Vietnamese lunar rules: lunar months start on the
 * astronomical new moon, and month 11 of each lunar year is defined as the month
 * containing the winter solstice (Đông chí), all computed for the GMT+7 / 105° East
 * meridian timezone used in Vietnam. A lunar year gains a leap month (tháng nhuận)
 * whenever the interval between two consecutive month-11s exceeds 365 days; the leap
 * month is the first month after that period without a major solar term.
 *
 * @param {Date} date - The solar (Gregorian) date to convert.
 * @param {number} [timeZone=7] - The UTC offset, in hours, to compute the conversion for. Defaults to Vietnam's GMT+7.
 * @returns {LunarDate} - The equivalent lunar calendar date.
 *
 * @example
 * convertSolarToLunar(new Date(2024, 1, 10)); // { day: 1, month: 1, year: 2024, isLeapMonth: false }
 * convertSolarToLunar(new Date(2025, 0, 29)); // { day: 1, month: 1, year: 2025, isLeapMonth: false }
 */
export function convertSolarToLunar(
  date: Date,
  timeZone = VN_TIMEZONE,
): LunarDate {
  const dayNumber = jdFromDate(
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear(),
  );
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);

  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }

  let a11 = getLunarMonth11(date.getFullYear(), timeZone);
  let b11 = a11;
  let lunarYear: number;

  if (a11 >= monthStart) {
    lunarYear = date.getFullYear();
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
  } else {
    lunarYear = date.getFullYear() + 1;
    b11 = getLunarMonth11(lunarYear, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);

  let isLeapMonth = false;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapMonthOffset = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthOffset) {
      lunarMonth = diff + 10;
      isLeapMonth = diff === leapMonthOffset;
    }
  }

  if (lunarMonth > 12) {
    lunarMonth -= 12;
  }

  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  return { day: lunarDay, month: lunarMonth, year: lunarYear, isLeapMonth };
}

/**
 * Converts a Vietnamese lunar calendar (âm lịch) date back into its corresponding
 * solar (Gregorian) date.
 *
 * This is the inverse of {@link convertSolarToLunar}: it locates the new moon that
 * starts the given lunar month (accounting for leap months) and adds the lunar day
 * offset to it.
 *
 * @param {LunarDate} lunar - The lunar calendar date to convert.
 * @param {number} [timeZone=7] - The UTC offset, in hours, to compute the conversion for. Defaults to Vietnam's GMT+7.
 * @returns {Date} - The equivalent solar (Gregorian) date.
 *
 * @example
 * convertLunarToSolar({ day: 1, month: 1, year: 2024, isLeapMonth: false }); // 2024-02-10
 * convertLunarToSolar({ day: 1, month: 1, year: 2025, isLeapMonth: false }); // 2025-01-29
 */
export function convertLunarToSolar(
  lunar: LunarDate,
  timeZone = VN_TIMEZONE,
): Date {
  const { day: lunarDay, month: lunarMonth, year: lunarYear, isLeapMonth } = lunar;

  let a11: number;
  let b11: number;

  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }

  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }

  if (b11 - a11 > 365) {
    const leapMonthOffset = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapMonthOffset - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }

    if (isLeapMonth && lunarMonth !== leapMonth) {
      throw new Error(
        `Lunar year ${lunarYear} has no leap month ${lunarMonth}.`,
      );
    } else if (isLeapMonth || off >= leapMonthOffset) {
      off += 1;
    }
  }

  const monthStart = getNewMoonDay(k + off, timeZone);
  const [day, month, year] = jdToDate(monthStart + lunarDay - 1);

  return new Date(year, month - 1, day);
}
//#endregion
