class L {
    lit() : String {
      {
        x <- "true";
--           ^ string
        y <- true;
--           ^ boolean
        z <- false;
--           ^ boolean
        w <- 1;
--           ^ number
        self;
--      ^ variable.builtin
      }
    };
};
