; Variables

(parameter
  name: (identifier) @definition.var)

(let_expression
  name: (identifier) @definition.var)

; Types

(class_item
  name: (type_identifier) @definition.type)

; Fields

(attribute_declaration
  name: (field_identifier) @definition.field)

; Scopes

[
  (block)
  (while_expression)
  (if_expression)
  (case_expression)
  (case_arm)
  (let_expression)

  (class_item)
  (method_declaration)
] @scope

