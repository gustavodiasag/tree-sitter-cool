class F {
--      ^ punctuation.bracket
    fn(_a : String, _b : Foo) : Bool {
--  ^ function
--    ^ punctuation.bracket
--     ^ variable.parameter
--        ^ punctuation.delimiter
--                  ^ variable.parameter
--                          ^ punctuation.bracket
        true
    };
--  ^ punctuation.bracket
--   ^ punctuation.delimiter

    func() : Bool {
--  ^ function
        self.fn(x, y) = fn(x, y);
--          ^ punctuation.delimiter
--           ^ function
--              ^ variable
--               ^ punctuation.delimiter
--                      ^ function
--                            ^ variable
    };
};
