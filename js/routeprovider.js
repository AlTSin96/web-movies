function RouteParser(route){
  'use strict';

  if(!route.match(/^\/(:?[a-z]+\/)*$/))
    throw new Error("Route Parser constructed with invalid route: " + route);
  else
    this.route = route;
  this.match = function(path){
    var routeRegex = new RegExp('^'+this.route.replace(/:[a-z]+/g,'[^\/]+')+'$');
    return Boolean(path.match(routeRegex));
  };

  this.extractParameters = function(path){
    if(this.match(path)){
      if(!this.route.match(/\:/))
        return {};
      var params = this.route.match(/:[a-z]+/g).map(function(s){
        return s.substring(1);
      });

      var valueRegex = new RegExp(this.route.replace(/:[a-z]+/g,'([^\/]+)'));
      var values = path.match(valueRegex);
      values.shift();

      var routeParameters = {};
      for(var i = 0;i<params.length;i++)
        routeParameters[params[i]] = values[i];
      return routeParameters;
    }
  };
}

function RouteProvider(){
  'use strict';
  var routes = [];

  var render = function(event){
    //If fired by a hashchange event, get the new hash which fired the event...
    var hash;
    if(event){
      hash = (event.newURL.match(/#!.*/) || [''])[0];
    }
    //...else, get the current hash.
    else{
      hash = window.location.hash;
    }
    
    //Transform hash into a valid path (e.g. #!movies -> /movies/)
    hash = hash.replace(/^#!/,'');
    if(!hash.match(/\/$/))
      hash += '/';
    
    //Check whether the hash matches a registered route.
    for(var i = 0;i<routes.length;i++){
      if(routes[i].route.match(hash)){
        routes[i].handler(routes[i].route.extractParameters(hash));
        break;
      }
    }
  };
  
  this.when = function(route,handler){
    routes.push({route:new RouteParser(route),handler:handler});
  };
  
  this.start = function(){
    render();
    window.onhashchange = render;
  };
}
