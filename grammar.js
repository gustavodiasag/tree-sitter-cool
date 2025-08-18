/**
 * @file Tree-sitter grammar for the Cool programming language
 * @author Gustavo Dias de Aguiar <gustavodias.aguiar1@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  /// '.'
  field: 8, 
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

const basicClasses = ['Bool', 'Int', 'IO', 'Object', 'String', 'SELF_TYPE'];

module.exports = grammar({
  name: 'cool',

  extras: $ => [
    /\s/,
    $.inline_comment,
    $.block_comment,
  ],

  rules: {
    source_file: $ => seq(
      repeat($.class_item),
    ),

    class_item: $ => seq(
      'class',
      field('name', $._type_identifier),
      optional(field('inherits', $.inherits)),
      field('features', $.field_declaration_list),
      ';',
    ),

    inherits: $ => seq(
      'inherits',
      $._type_identifier,
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
      field('name', $identifier),
      ':',
      field('type', $._type_identifier),
      ';',
    ),

    method_declaration: $ => seq(
      field('name', $.identifier),
      field('parameters', $.parameters),
      ':',
      optional(seq(
        ':',
        field('return_type', choice($._type_identifier, self_type)))
      ),
      field('body', $.block),
    ),

    parameters: $ => seq(
      '(',
      sepBy(',', $.parameter),
      ')',
    ),

    parameter: $ => seq(
      field('name', $identifier),
      ':',
      field('type', $._type_identifier),
    ),

    block: $ => seq(
      '{',
      repeat($._expression),
      '}',
    ),

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
