package tree_sitter_cool_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_cool "github.com/gustavodiasag/tree-sitter-cool/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_cool.Language())
	if language == nil {
		t.Errorf("Error loading Cool grammar")
	}
}
