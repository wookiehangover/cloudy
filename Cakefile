{log} = require('util')
fs      = require('fs')
path    = require('path')
stitch  = require('stitch')
uglify  = require('uglify-js')

uglyStick = ( file, minfile, no_squeeze ) ->
  jsp = uglify.parser
  pro = uglify.uglify

  fs.readFile file, 'utf8', (err, fileContents) ->
    ast = jsp.parse fileContents  # parse code and get the initial AST
    ast = pro.ast_mangle ast # get a new AST with mangled names
    ast = pro.ast_squeeze ast unless no_squeeze
    final_code = pro.gen_code ast # compressed code here

    fs.writeFile minfile, final_code

    log "Uglified #{minfile}"

sew = ( filename, paths, deps ) ->
  pkg = stitch.createPackage( paths: paths, dependencies: deps )

  pkg.compile ( err, src ) ->
    fs.writeFile filename, src, ( err ) ->
      throw err if err
      log "Compiled #{filename}"
      uglyStick filename, filename.replace(/\.js/, '.min.js')


task 'build:libs', ->
  root  = path.resolve('./public/js/libs')
  paths = [ root ]
  deps  = [ "#{root}/underscore.js" ]

  sew( 'public/js/src/libs.js', paths, deps )

task 
