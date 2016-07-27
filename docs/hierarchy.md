# Class hierarchy / relationship

```

  +-----------+              +--------+                                                                               +------------+
  | MindBlown |------------->| Slides |                                                                 .------------>| Renderable |
  +-----------+              +--------+                                                                /              +------------+
                             * load()                                                                  |              * traverseChildren
                                   \         +--------+                                                |              * activate
                                    \------> | Loader |                                                |              * deactivate
                                             +--------+                                                |              * render
                                                  \         +-------------------+                      |
                                                   \------->| HTMLto3DConverter |                      |
                                                            +-------------------+                     /
                                                                   \                +------------------------+
                                                                    \-------------->| HTMLto3DSlideConverter |
                                                                                    +------------------------+




```
