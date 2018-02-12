def Page main
  global:
    Button b0: Button that would not be rendered
  header:
    Button b1: Button in header
    Keyboard kb
  Button b2: Button not in header


//More deps for main<Page> in `main`: Keyboard (test/qs/container.qs:1:10) 		C:\work\quokka-script\Core\Compile\Compiler.js:1036:29
//More deps for header<nt> in `main`: Keyboard (test/qs/container.qs:1:10) 		C:\work\quokka-script\Core\Compile\Compiler.js:1036:29
/*
{ _name: 'class',
       data: 'Keyboard',
       pointer: [Object],
       type: 'WORD',
       leaf: true } } ]
       */