/**
 * @file Cool grammar for tree-sitter
 * @author Gustavo Aguiar <gustavodias.aguiar1@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  /// '.'
  call: 8, 
  /// '@'
  super: 7,
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

const TOKEN_TREE_NON_SPECIAL_PUNCTUATION = [
  '=', '<=', '<', '~', '/', '*', '-',
  '+', ':', '=>', ';', '<-', ',', '@',
];

const primitiveTypes = ['Bool', 'Int', 'IO', 'Object', 'String', 'SELF_TYPE'];

module.exports = grammar({
  name: 'cool',

  extras: $ => [
    /\s/,
    $.inline_comment,
    $.block_comment,
  ],

  externals: $ => [
    $.string_content,
    $._error_sentinel,
  ],

  inline: $ => [
    $._field_identifier,
    $._non_special_token,
  ],

  rules: {
    source_file: $ => repeat($.class_item),

    // Section - Declarations

    class_item: $ => seq(
      'class',
      field('name', $.type_identifier),
      optional(
        seq(
          'inherits',
          field('inherits', $._type))
      ),
      field('features', $.field_declaration_list),
      ';',
    ),

    field_declaration_list: $ => seq(
      '{',
      repeat(seq(
        choice(
          $.attribute_declaration,
          $.method_declaration,
        ),
        ';',
      )),
      '}',
    ),

    attribute_declaration: $ => seq(
      field('name', $._field_identifier),
      ':',
      field('type', $._type),
      optional(seq('<-', field('right', $._expression))),
    ),

    method_declaration: $ => seq(
      field('name', $.identifier),
      field('parameters', $.parameters),
      ':',
      field('return_type', $._type),
      '{',
      field('body', $._expression),
      '}',
    ),

    parameters: $ => seq(
      '(',
      sepBy(',', $.parameter),
      ')',
    ),

    parameter: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $._type),
    ),

    // Section - Types

    _type: $ => choice(
      $.type_identifier,
      alias(choice(...primitiveTypes), $.primitive_type),
    ),
    
    // Section - Expressions

    _expression: $ => choice(
      $._literal,
      $.identifier,
      $.self,
      $.assignment_expression,
      $.dispatch_expression,
      $.if_expression,
      $.while_expression,
      $.block,
      $.let_expression,
      $.case_expression,
      $.new_expression,
      $.isvoid_expression,
      $.not_expression,
      $.unary_expression,
      $.binary_expression,
      $.parenthesized_expression,
    ),

    assignment_expression: $ => prec.left(PREC.assign, seq(
      field('left', $.identifier),
      '<-',
      field('right', $._expression),
    )),

    dispatch_expression: $ => prec(PREC.call, seq(
      optional(
        prec(PREC.super, seq(
          field('value', $._expression),
          optional(seq(
            '@', 
            field('type', $._type))),
          '.',
        )),
      ),
      field('method', $.identifier),
      field('arguments', $.arguments),
    )),

    arguments: $ => seq(
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

    block: $ => seq(
      '{',
      sepBy(';', $._expression),
      ';',
      '}',
    ),

    let_expression: $ => seq(
      'let',
      sepBy(',', seq(
        field('name', $.identifier),
        ':',
        field('type', $._type),
        optional(seq('<-', field('right', $._expression))),
      )),
      'in',
      field('body', $._expression),
    ),

    case_expression: $ => seq(
      'case',
      field('value', $._expression),
      'of',
      field('body', sepBy(';', $.case_arm)),
      optional(';'),
      'esac'
    ),

    case_arm: $ => prec.right(seq(
      field('pattern', $.case_pattern),
      '=>',
      field('value', $._expression),
    )),

    case_pattern: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $._type),
    ),

    new_expression: $ => seq(
      'new',
      field('type', $._type),
    ),

    isvoid_expression: $ => prec(PREC.isvoid, seq(
      'isvoid',
      $._expression,
    )),

    not_expression: $ => prec(PREC.negation, seq(
      'not',
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
        ([precedence, operator]) => prec.left(precedence, seq(
          field('left', $._expression),
          // @ts-ignore
          field('operator', operator),
          field('right', $._expression),
      ))));
    },

    parenthesized_expression: $ => seq(
      '(',
      $._expression,
      ')',
    ),

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

    /**
    * Identifiers are strings consisting of letters, sigits, and the underscore
    * character.
    *
    * Type identifiers begin with a capital letter; object identifiers begin
    * with a lower case letter.
    */
    identifier: _ => /[_\p{XIDStart}][_\p{XID_Continue}]*/,
    type_identifier: $ => /[\p{Lu}][_\p{XID_Continue}]*/,

    _field_identifier: $ => alias($.identifier, $.field_identifier),

    self: _ => 'self',

    _non_special_token: $ => choice(
      $_literal, $.identifier, $.self,
      alias(choice(...primitiveTypes), $.primitive_type),
      prec.right(repeat1(choice(...TOKEN_TREE_NON_SPECIAL_PUNCTUATION))),
    ),
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
 * Creates a rule to optionally match one or more of the rules separated by the
 * separator.
 *
 * @param {RuleOrLiteral} sep - The separator to use.
 * @param {RuleOrLiteral} rule
 *
 * @returns {ChoiceRule}
 */
function sepBy(sep, rule) {
  return optional(sepBy1(sep, rule));
}
