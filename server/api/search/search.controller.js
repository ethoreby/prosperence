'use strict';

var cloudsearchdomain = require(__dirname + "/../../config/endpoints").cloudsearchdomain;

exports.search = function(req, res) {
  var params = {};
  params.size = req.body.limit || 9;
  params.start = req.body.start || 0;
  params.partial = true;

  if(typeof req.body.q === "undefined" || req.body.q === "" || req.body.filters) {
    params.queryParser = 'simple';

    // build text query
    if(req.body.q) {
      params.query = req.body.q ? req.body.q : "~1";
    } else {
      params.queryParser = 'structured';
      params.query = "(matchall)";
    }

    //build facet query
    if(req.body.filters && req.body.filters.length > 0) {
      var filtersArray = req.body.filters;
      var filterHolder = {};
      filtersArray.forEach(function(filter) {
        //group filters by term
        if(filterHolder[filter.term] && filterHolder[filter.term].length > 0) {
          filterHolder[filter.term].push(filter.value);
        } else {
          filterHolder[filter.term] = [];
          filterHolder[filter.term].push(filter.value);
        }
      });

      params.filterQuery = "(and ";
      for(var key in filterHolder) {
        params.filterQuery += "(or ";
        filterHolder[key].forEach(function(value) {

          // check if range query or facet filter term query
          if(key === 'duration'){
            params.filterQuery += '( range field=' + key + ' ' +  value + ')';
          } else {
            params.filterQuery += key + ":'" + value + "' ";
          }
        });
        params.filterQuery += ") ";
      }
      params.filterQuery += ")";
    }
  } else {
    params.query = req.body.q;
    params.queryParser = 'simple';
  }

  // add sorting parameter
  if(typeof req.body.sort !== "undefined") {
    params.sort = req.body.sort;
  }

  // only add facets to params if params sent in request
  if(typeof req.body.facets !== "undefined") {
    params.facet = function() {
      var facets = req.body.facets.split(",") || [];
      var facetsString = "{";
      for(var i = 0; i < facets.length; i++) {
        facetsString += '"' + facets[i] + '":{"sort":"bucket", "size":25}';

        if(i !== facets.length - 1) {
          facetsString += ",";
        }
      }
      facetsString += "}";

      return facetsString;
    }()
  }

  console.log(params);
  cloudsearchdomain.search(params, function(err, data) {
    if(err) {
      res.json(err);
      console.log(err, err.stack);
    } else {
      var _results = {};
      _results.results = [];

      //add total results found
      _results.totalCount = data.hits.found;

      //add facets
      _results.facets = data.facets;

      var isData = data.hits.hit.length > 0;
      if(isData) {
        for(var i = 0; i < data.hits.hit.length; i++) {
          var course = {};
          var result = data.hits.hit[i];

          //add fields
          course.youtube_id = result.fields.youtube_id[0];
          course.category = result.fields.category;
          course.title = result.fields.title[0];
          course.url = result.fields.url[0];
          course.minutes = Math.ceil(result.fields.duration[0] / 60);
          course.image_url = result.fields.image_url[0];

          _results.results.push(course);

          if(_results.results.length === data.hits.hit.length) {
            res.end(JSON.stringify({
              data: _results
            }));
          }
        }
      } else {
        res.end(JSON.stringify({
          data: []
        }));
      }
    }
  })
};

exports.suggest = function(req, res) {
  var params = {
    query: req.body.q, /* required */
    suggester: 'title', /* required */
    size: 10
  };

  if(req.body.q) {
    cloudsearchdomain.suggest(params, function(err, data) {
      if(err) {
        res.json(err);
        console.log(err, err.stack);
      } else {
        var _results = [];
        var isData = data.suggest.suggestions.length > 0;
        if(isData) {

          for(var i = 0; i < data.suggest.suggestions.length; i++) {
            var course = {};
            var result = data.suggest.suggestions[i];
            course.title = result.suggestion;
            _results.push(course);

            if(_results.length === data.suggest.suggestions.length - 1) {
              res.end(JSON.stringify({
                data: _results
              }));
            }
          }
        } else {
          res.end(JSON.stringify({
            data: []
          }));
        }
      }
    });
  } else {
    res.end(JSON.stringify({
      data: []
    }));
  }
};
