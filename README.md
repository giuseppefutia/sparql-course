# SPARQL 
All'interno di questo repository viene fornita un'introduzione a SPARQL, protocollo e linguaggio di query per dati pubblicati ed esposti secondo il modello RDF. 

Per proporre modifiche ed arricchire questo repository potete utilizzare il [meccanismo delle pull-request offerto da GitHub](https://help.github.com/articles/using-pull-requests/).

## Introduzione
[TODO]

## Architettura ed endpoint SPARQL
* Le query SPARQL vengono eseguite su dataset pubblicati secondo il modello RDF. 
* Un endpoint SPARQL è in grado di accettare ed eseguire query i cui risultati sono disponibili via HTTP.
    * A seconda delle impostazioni definite sugli endpoint, è possibile interrogare dati appartenenti a dataset differenti.
* I risultati di una query SPARQL possono essere "renderizzati" secondo diversi formati.
    * **XML**. SPARQL prevede uno specifico vocabolario per ottenere i risultati sotto forma di tabelle.
    * **JSON**. Consiste in un *porting* del vocabolario XML definito in SPARQL. Recentemente si sta affermando un formato chiamato [JSON-LD](http://json-ld.org/), che risulta molto più leggibile per gli esseri umani e si presta ad essere facilmente utilizzabile nell'ambito di servizi REST e per importare dati in database quali MongoDB.
    * **RDF**. Per specifici risultati dell'endpoint (costruiti tramite query CONSTRUCT) si ottengono dati in RDF serializzabili in diversi formati (RDF/XML, N-Triples, Turtle, ecc.).
    * **HTML**. Quando viene utilizzato un form per gestire le query SPARQL. In genere viene implementato applicando un XLS per trasfomrare i risultati dal formato XML.

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

## Identificazioni di pattern all'interno di dati RDF

## Filtri in SPARQL

## Operatori in SPARQL

## Requisiti opzionali all'interno delle query

## Costrutti in SPARQL: ASK, DESCRIBE, CONSTRUCT

## Query avanzate

### Negazione in una query SPARQL

### Query federate: combinare dati provenienti da diversi endpoint
