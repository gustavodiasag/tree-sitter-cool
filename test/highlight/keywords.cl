class K inherits String {
-- ^ keyword
--      ^ keyword
    a : Int <- {
        let x : Int in (
--      ^ keyword
--                  ^ keyword
            if true then
--          ^ conditional
--                  ^ conditional
              while x < 10 loop
--            ^ repeat
--                         ^ repeat
                x <- x + 2
              pool
--            ^ repeat
            else
--          ^ conditional
              if x > 20 then
                case x of
--              ^ keyword
--                     ^ keyword
                  i : Int => (new Int);
--                            ^ keyword
                  _ : Object => 10;
                esac
--              ^ keyword
            fi fi
--          ^ conditional
        )
    };
};
