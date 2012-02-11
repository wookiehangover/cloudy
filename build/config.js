// This is the main Backbone Boilerplate build configuration file.
//
// This is a JavaScript file, you can define any functions you would like in
// here.
config.init({

  lint: {
    files: ["build/config.js"]
  },

  concat: {

    // The core library files
    "assets/js/src/libs.js": [
      "assets/js/libs/underscore.js",
      "assets/js/libs/backbone.js",
      "assets/js/libs/plugins/*.js"
    ]

  },

  stitch: {
    "assets/js/src/app.js": {
      paths: ["app"]
    }
  },

  "handlebars-jst": {
    "assets/js/src/templates.js": ["app/views"]
  },

  min: {
    "assets/js/src/libs.min.js": ["assets/js/src/libs.js"],
    "assets/js/src/app.min.js": ["assets/js/src/app.js"],
    "assets/js/src/templates.min.js": ["assets/js/src/templates.js"]
  },

  mincss: {
    "assets/css/style.min.css": ["assets/css/style.css"]
  },

  watch: {
    files: ["app/**/*"],
    tasks: "stitch concat handlebars-jst",

    min: {
      files: ["assets/**/*", "app/**/*"],
      tasks: "default"
    }
  },

  clean: {
    folder: "dist/"
  }

});

// Run the following tasks...
task.registerTask("default", "stitch concat handlebars-jst min mincss");
