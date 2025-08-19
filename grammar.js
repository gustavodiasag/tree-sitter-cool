/**
 * @file Tree-sitter grammar for the Cool programming language
 * @author Gustavo Dias de Aguiar <gustavodias.aguiar1@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  /// '.'
  call: 8, 
  /// '@'
  _super: 7,
  /// '~'
  comp: 6,
  /// 'isvoid'
  isvoid: 5,
  /// '*' '/'
  multiplicative: 4,
  /// '+' '-'
  additive: 3,
  /// '<=' '<' '='
  comparative: 2,
  /// 'not'
  negation: 1,
  /// '<-'
  assign: 0,
}

const NON_SPECIAL_PUNCTUATION = [
  '=', '<=', '<', '~', '/', '*', '-',
  '+', ':', '=>', ';', '<-', ',', '@',
];

const basicTypes = ['Bool', 'Int', 'IO', 'Object', 'String', 'SELF_TYPE'];

module.exports = grammar({
  name: 'cool',

  extras: $ => [
    /\s/,
    $.inline_comment,
    $.block_comment,
  ],

  rules: {
    source_file: $ => repeat($.class_item),

    class_item: $ => seq(
      'class',
      field('name', $.type_identifier),
      optional(field('inherits', $.inherits)),
      field('features', $.field_declaration_list),
      ';',
    ),

    inherits: $ => seq(
      'inherits',
      $.type_identifier,
    ),

    field_declaration_list: $ => seq(
      '{',
      repeat(
        choice(
          $.attribute_declaration,
          $.method_declaration,
        ),
      ),
      '}',
    ),

    attribute_declaration: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $.type_identifier),
      ';',
    ),

    method_declaration: $ => seq(
      field('name', $.identifier),
      field('parameters', $.parameters),
      ':', // Is a return type is always required?
      field('return_type', $.type_identifier),
      field('body', $.block),
      ';',
    ),

    parameters: $ => seq(
      '(',
      sepBy(',', $.parameter),
      ')',
    ),

    parameter: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $.type_identifier),
    ),

    block: $ => seq(
      '{',
      repeat($._expression),
      '}',
    ),

    _expression: $ => choice(
      $._literal,
      $.identifier,
      $.assignment_expression,
      $.dispatch_expression,
      $.if_expression,
      $.while_expression,
      $.block,
      $.let_expression,
      $.case_expression,
      $.new_expression,
      $.isvoid_expression,
      $.unary_expression,
      $.binary_expression,
    ),

    assignment_expression: $ => prec.left(PREC.assign, seq(
      field('left', $.identifier),
      '<-',
      field('right', $._expression),
    )),

    dispatch_expression: $ => prec(PREC.call, seq(
      optional(seq(
        field('value', $._expression),
        optional(seq('@', $.type_identifier)),
        '.',
      )),
      field('method', $.identifier),
      field('arguments', $.args),
    )),

    args: $ => seq(
      '(',
      sepBy(',', $._expression),
      ')',
    ),

    if_expression: $ => prec.right(seq(
      'if',
      field('condition', $._expression),
      'then',
      field('consequence', $._expression),
      optional(seq(
        'else',
        field('alternative', $._expression),
      )),
      'fi',
    )),

    while_expression: $ => seq(
      'while',
      field('condition', $._expression),
      'loop',
      field('body', $._expression),
      'pool'
    ),

    let_expression: $ => seq(
      'let',
      sepBy(',', seq(
        field('name', $.identifier),
        ':',
        field('type', $.type_identifier),
        optional(seq('<-', field('right', $._expression))),
      )),
      'in',
      field('body', $._expression),
    ),

    case_expression: $ => seq(
      'case',
      field('value', $._expression),
      'of'
      sepBy(';', $.case_arm),
      field('body', $.case_block),
      'esac'
    ),

    case_arm: $ => prec.right(seq(
      field('pattern', $.case_pattern),
      '=>'
      field('value', $._expression),
    )),

    case_pattern: $ => seq($.identifier, ':', $.type_identifier),

    new_expression: $ => seq(
      'new',
      field('type', $.type_identifier),
    ),

    isvoid_expression: $ => prec(PREC.isvoid, seq(
      'isvoid',
      $._expression,
    )),

    unary_expression: $ => prec(PREC.comp, seq(
      '~',
      $._expression,
    )),

    binary_expression: $ => {
      const table = [
        [PREC.comparative, choice('<=', '<', '=')],
        [PREC.additive, choice('+', '-')],
        [PREC.multiplicative, choice('*', '/')],
      ];

      // @ts-ignore
      return choice(...table.map(
        ([precedence, operator]) => pref.left(precedence, seq(
          field('left', $._expression),
          // @ts-ignore
          field('operator', $.operator),
          field('right', $._expression),
      ))));
    },

    _literal: $ => choice(
      $.boolean_literal,
      $.integer_literal,
      $.string_literal,
    ),

    boolean_literal: _ => choice('true', 'false'),

    integer_literal: _ => token(/[0-9]+/),

    string_literal: $ => seq(
      '"',
      repeat(choice(
        $.string_content,
        $.escape_sequence,
      )),
      token.immediate('"'),
    ),

    string_content: _ => /[^"\\\n]+/,

    escape_sequence: _ => /\\[bntf"]/,

    comment: $ => choice(
      $.inline_comment,
      $.block_comment,
    ),

    inline_comment: _ => seq(
      '--',
      /.*/,
    ),

    block_comment: _ => seq(
      '(*',
      repeat(
        choice(
          /[^*]/,
          /\*[^)]/,
        ),
      ),
      '*)',
    ),

    // Identifiers are strings consisting of letters, sigits, and the underscore
    // character. Type identifiers begin with a capital letter; object
    // identifiers begin with a lower case letter.
    type_identifier: $ => /[\p{Lu}][_\p{XID_Continue}]*/,

    identifier: _ => /[_\p{XIDStart}][\p{XID_Continue}]*/,
  },
});

/**
 * Creates a rule to match one or more of the rules separated by the separator.
 *
 * @param {RuleOrLiteral} sep - The separator to use.
 * @param {RuleOrLiteral} rule
 *
 * @returns {SeqRule}
 */
function sepBy1(sep, rule) {
  return seq(rule, repeat(seq(sep, rule)));
}

/**
 * Creates a rule to optionally match one or more of the rules separated by the separator.
 *
 * @param {RuleOrLiteral} sep - The separator to use.
 * @param {RuleOrLiteral} rule
 *
 * @returns {ChoiceRule}
 */
function sepBy(sep, rule) {
  return optional(sepBy1(sep, rule));
}
