fs      = require('fs')
path    = require('path')
tmpl    = require('handlebars-jst')
{log}   = require('util')
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
  pkg = stitch.createPackage( paths: paths, dependencies: deps || [] )

  pkg.compile ( err, src ) ->
    fs.writeFile filename, src, ( err ) ->
      throw err if err
      log "Compiled #{filename}"
      uglyStick filename, filename.replace(/\.js/, '.min.js')

task 'build', ->
  root  = path.resolve('./app')
  paths = [ root ]

  sew 'public/js/src/app.js', paths

task 'build:libs', ->
  root  = path.resolve('./public/js/libs')
  paths = [ root ]
  deps  = [ "#{root}/underscore.js", "#{root}/handlebars.1.0.0.beta.2.js" ]

  sew 'public/js/src/libs.js', paths, deps

task 'build:templates', ->
  filename = "public/js/src/templates.js"

  tmpl.build 'app/views', ( data ) ->
    tmpl.process data, 'public/js/src', ->
      uglyStick( filename, filename.replace(/\.js/, '.min.js'), true )
