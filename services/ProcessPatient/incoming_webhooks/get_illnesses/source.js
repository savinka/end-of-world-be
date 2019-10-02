get_illnesses = function(illnesses, url) {
  return context.http.get({
        "url": url
      })
      .then((res) => EJSON.parse(res.body.text()))
      .then((res)=> {  illnesses = illnesses.concat(res._embedded.illnesses);
                       if (res._links.next) {
                         illnesses = get_illnesses(illnesses, res._links.next.href);
                         }
                        return illnesses;
      });
};

// This function is the webhook's request handler.
exports = function(payload, response) {
    
    return get_illnesses([], "http://dmmw-api.australiaeast.cloudapp.azure.com:8080/illnesses");
};