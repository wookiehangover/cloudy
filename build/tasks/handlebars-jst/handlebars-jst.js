var handlebars = require("handlebars-jst");

task.registerBasicTask("handlebars-jst", "Compile handlebars templates to JST file", function(data, name){
  // If namespace is specified use that, otherwise fallback
  var namespace = config("jst.namespace") || "JST";
  // If template settings are available use those
  var templateSettings = config("jst.templateSettings") || null;

  // Create JST file.
  var errorcount = fail.errorcount;
  //var files = file.expand(data);
  file.write(name, task.helper('handlebars-jst', data, namespace, templateSettings));

  // Fail task if there were errors.
  if (fail.errorcount > errorcount) { return false; }

  // Otherwise, print a success message.
  log.writeln("File \"" + name + "\" created.");
});


task.registerHelper("handlebars-jst", function(files, namespace, templateSettings) {

  var contents = files ? files.map(function( dir ){
    return handlebars.build( dir );
  }).join('\n\n') : "";

  return contents;
});
