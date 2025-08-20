class Main inherits IO {
  main() : Int {
    0
  };

  out : Int <- {
    out_string("2 is trivially prime.\n");
    2;
  };

  testee : Int <- out;
  
  divisor : Int;

  divisor : Int;

  stop : Int <- 500;

  m : Object <-
    while true loop
      {
        testee <- testee + 1;
        divisor <- 2;

        while
          if testee < divisor * divisor
            then false
          else if testee - divisor*(testee/divisor) = 0
            then false
          else
            true
          fi fi
        loop
          divisor <- divisor + 1
        pool;
        
        if testee < divisor * divisor
        then
          {
            out <- testee;
            out_int(out);
            out_string(" is prime.\n");
          }
        else
          0
        fi;

        if stop <= testee then
          "halt".abort()
        else
          "continue"
        fi;
      }
    pool;
};
