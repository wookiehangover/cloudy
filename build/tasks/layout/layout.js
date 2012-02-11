task.registerBasicTask("layout:development", "Compile handlebars layout/index to index.html file in development", function(data, name){

  task.helper("compile", {name: name, env: "development"});

});

task.registerBasicTask("layout:production", "Compile handlebars layout/index to index.html file in production", function(data, name){

  task.helper("compile", {name: name, env: "production"});

});

task.registerHelper("compile", function(options) {

  var
    data = {},
    fs = require("fs"),
    handlebars = require("handlebars"),
    template = fs.readFileSync( 'app/templates/layout/index.jst', 'utf8' );

  data[options.env] = true;

  var compiled_template = handlebars.compile(template);
  file.write(options.name, compiled_template(data));

});

