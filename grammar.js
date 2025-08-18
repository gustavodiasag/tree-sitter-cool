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
