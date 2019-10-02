get_hospitals = function(hospitals, url) {
  return context.http.get({
        "url": url
      })
      .then((res) => EJSON.parse(res.body.text()))
      .then((res)=> {  hospitals = hospitals.concat(res._embedded.hospitals);
                       if (res._links.next) {
                         hospitals = get_hospitals(hospitals, res._links.next.href);
                         }
                        return hospitals;
      });
};

// This function is the webhook's request handler.
exports = function(payload, response) {

    const mongodb = context.services.get("mongodb-atlas");
    const patients = mongodb.db("myDB").collection("patients");
    const body = EJSON.parse(payload.body.text());
    const pain = body.levelOfPain;
    patients.insertOne(EJSON.parse(payload.body.text()));

    
    return get_hospitals([], "http://dmmw-api.australiaeast.cloudapp.azure.com:8080/hospitals")
    .then(res => res.map(x => { return {name:x.name, waitingTime: x.waitingList[pain].averageProcessTime * x.waitingList[pain].patientCount, id:x.id}}).sort((x,y)=> x.waitingTime - y.waitingTime));
};

