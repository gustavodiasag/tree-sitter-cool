#include "tree_sitter/alloc.h"
#include "tree_sitter/parser.h"

enum TokenType
{
    STRING_CONTENT,
    ERROR_SENTINEL,
};

static inline bool process_string(TSLexer* lexer);

void* tree_sitter_cool_external_scanner_create()
{
    // This function should create a custom scanner object. It will only be
    // calle once anytime the language is set of a parser. If the external
    // scanner doesn't need to mintain any state, it's ok to return `NULL`
    return NULL;
}

void tree_sitter_cool_external_scanner_destroy()
{
    // No-op function. No allocation is made for a scanner creation.
}

unsigned tree_sitter_cool_external_scanner_serialize(void* payload,
                                                     char* buffer)
{
    return 0;
}

void tree_sitter_cool_external_scanner_deserialize(void* payload,
                                                 const char* buffer,
                                                 unsigned length)
{
    // ...
}

bool tree_sitter_cool_external_scanner_scan(void* payload, TSLexer* lexer, 
                                            const bool* valid_symbols)
{
    // During error recovery, Tree-sitter's first step is to call the external
    // scanner's scan function with all tokens marked as valid. The scanner
    // should detect and handle this case appropriately. One simple approach is
    // to add an unused sentinel token at the end of the externals array.
    //
    // https://tree-sitter.github.io/tree-sitter/creating-parsers/4-external-scanners.html
    if (valid_symbols[ERROR_SENTINEL]) {
        return false;
    }

    if (valid_symbols[STRING_CONTENT]) {
        return process_string(lexer);
    }

    return false;
}

static inline char advance(TSLexer* lexer)
{
    lexer->advance(lexer, false);
    return (char)lexer->lookahead;
}

static inline bool process_string(TSLexer* lexer)
{
    bool has_content = false;
    bool escape_char = false;

    for (;;) {
        if (lexer->lookahead == '\"') {
            break;
        }
        if (lexer->eof(lexer)) {
            return false;
        }
        has_content = true;

        switch (advance(lexer)) {
            case '\\':
                escape_char = true;
                break;
            case '\n':
                if (!escape_char) {
                    return false;
                }
            default:
                escape_char = false;
                break;
        }
    }
    lexer->result_symbol = STRING_CONTENT;
    lexer->mark_end(lexer);

    return has_content;
}
