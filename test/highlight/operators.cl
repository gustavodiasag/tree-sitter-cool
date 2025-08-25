class O inherits String {
    op() : Int {
        a <- {
--        ^ operator
          if x = y then
--             ^ operator
              ~(x * y / z - w) + 1
--            ^ operator
--                ^ operator
--                    ^ operator
--                        ^ operator
--                             ^ operator
          else if x <= y then
--                  ^ operator
              case "foo" of
                  s : String => isvoid s
--                              ^ keyword.operator
                  _ : Object => 0
--                           ^ operator
              esac
          else if not (x < y) then
--                ^ keyword.operator
--                       ^ operator
              bar@String.length("x")
--               ^ operator
          fi fi fi;
        }
    };
};
