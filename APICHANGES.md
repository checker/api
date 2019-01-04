# Suggested API changes

This would break the API so these features will not be upstreamed.

## API: /check/services

Having an extra object is kind of redundent, it would make more sense to just send a JSON array.

For example:
`
[
    "twitter",
    "instagram",
    "steamid",
    "steamgroup",
    "mixer",
    "youtube"
]
`

DIFF:
`
  - var simple = {"services": []};
  + var simple = [];
  var advanced = require('./services.json');
  for (var key in advanced.services) {
    - simple.services.push(advanced.services[key].slug)
  	+ simple.push(advanced.services[key].slug)
`