# CSV Triplifier
A simple script to transform a CSV file in RDF using a configuration JSON to
drive the triplification stage.

Sample usage:

```
node csvTriplifier.js [baseURI] [input data file path] [configuration file path] [output file path]
```

Example:

```javascript
node csvTriplifier.js http://mydomain.org/ data.csv conf.json output
```
