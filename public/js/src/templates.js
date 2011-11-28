(function(){this.JST || (this.JST = {});this.JST["image"] = function(context) { return HandlebarsTemplates["image"](context); };this.HandlebarsTemplates || (this.HandlebarsTemplates = {});this.HandlebarsTemplates["image"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<a href=\"";
  stack1 = helpers.Key || depth0.Key
  stack2 = helpers.url || depth0.url
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, stack1, { hash: {} }); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "url", stack1, { hash: {} }); }
  else { stack1 = stack2; }
  buffer += escapeExpression(stack1) + "\">\n  <img src=\"";
  stack1 = helpers.Key || depth0.Key
  stack2 = helpers.url || depth0.url
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, stack1, { hash: {} }); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "url", stack1, { hash: {} }); }
  else { stack1 = stack2; }
  buffer += escapeExpression(stack1) + "\">\n</a>\n";
  return buffer;});}).call(this);