class I {
-- ^ keyword
--    ^ type
    a : String;
--  ^ property
--      ^ type.builtin
    b : Int <- (
      let c : Int in
--    ^ keyword
--        ^ variable
--                ^ keyword
        c
--      ^ variable
    );
};
