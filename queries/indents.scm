; https://github.com/nvim-treesitter/nvim-treesitter/blob/master/CONTRIBUTING.md#indents
;
; @indent.begin        Indent children when matching this node
; @indent.end          Marks the end of indented block
; @indent.align        Behaves like python aligned/hanging indent
; @indent.dedent       Dedent children when matching this node
; @indent.branch       Dedent itself when matching this node
; @indent.ignore       Do not indent in this node
; @indent.auto         Behaves like 'autoindent' buffer option
; @indent.zero         Sets this node at position 0 (no indent)

[
  (class_item)
  (method_declaration)
  (dispatch_expression)
  (assignment_expression)
  (let_expression)
  (while_expression)
  (case_expression)
  (case_arm)
  (block)
] @indent.begin

[
  "("
  ")"
  "{"
  "}"
] @indent.branch

[
  (inline_comment)
] @indent.ignore
