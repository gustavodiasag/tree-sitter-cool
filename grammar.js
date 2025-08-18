/**
 * @file Tree-sitter grammar for the Cool programming language
 * @author Gustavo Dias de Aguiar <gustavodias.aguiar1@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "cool",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
