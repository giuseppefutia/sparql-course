# SPARQL 
All'interno di questo repository viene fornita un'introduzione a SPARQL, protocollo e linguaggio di query per dati pubblicati ed esposti secondo il modello RDF.

## Introduzione
[TODO]

## Struttura base di una query SPARQL
Una query SPARQL prevede nell'ordine:

* Dichiarazione dei prefissi per poter abbreviare gli URI all'interno della query.
* Specificazione del grafo RDF sul quale eseguire la query (non strettamente necessario nel caso in cui si volessero interrogare tutti i dati pubblicati sull'endpoint).
* Definizione dei risultati che voglio ottenere con una query SPARQL.
* Contruzione della query per individuare informazioni specifiche contenute all'interno del dataset. 
* Inserimento di modificatori per riorganizzare, suddividere, riordinare, ecc. il risultato della query.

```
# dichiarazione dei prefissi
PREFIX foo: <http://example.com/resources/>
...
# specificazione del dataset
FROM ...
# definizione dei risultati
SELECT ...
# query
WHERE {
    ...
}
# modificatori
ORDER BY ...
```
