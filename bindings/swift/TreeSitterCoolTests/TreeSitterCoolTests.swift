import XCTest
import SwiftTreeSitter
import TreeSitterCool

final class TreeSitterCoolTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_cool())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Cool grammar")
    }
}
