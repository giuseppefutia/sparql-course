# SPARQL 
All'interno di questo repository viene fornita un'introduzione a SPARQL, protocollo e linguaggio di query per dati pubblicati ed esposti secondo il modello RDF. 

Per proporre modifiche ed arricchire questo repository potete utilizzare il [meccanismo delle pull-request offerto da GitHub](https://help.github.com/articles/using-pull-requests/).

## Introduzione
[TODO]

## Architettura ed endpoint SPARQL
* Le query SPARQL vengono eseguite su dataset pubblicati secondo il modello RDF. 
* Un endpoint SPARQL è in grado di accettare ed eseguire query i cui risultati sono disponibili via HTTP.
    * A seconda delle impostazioni definite sugli endpoint, è possibile interrogare e combinare tra loro dati appartenenti a dataset differenti.
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

## Dataset di riferimento
* DBpedia (sito del progetto, endpoint SPARQL)
* DBpedia Italia (sito del progetto, endpoint SPARQL)

## Identificazioni di pattern all'interno di dati RDF
[TODO]

### Query #1 Clausola SELECT, variabili e pattern di triple
All'interno del dataset DBPedia identifica la label (ovvero la stringa human readable) che si riferisce alla risorsa http://dbpedia.org/page/Stanley_Kubrick. Generalmente le label sono associate alle risorse tramite il predicato *rdf:label*  

```
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?label
WHERE {
   <http://dbpedia.org/resource/Stanley_Kubrick> rdfs:label ?label
}
```

* [Endpoint](http://dbpedia.org/sparql)
* [Risultato dall'endpoint](http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Flabel%0D%0AWHERE+%7B%0D%0A+++%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FStanley_Kubrick%3E+rdfs%3Alabel+%3Flabel+.%0D%0A%7D&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on)

#### Tips
* In SPARQL le variabili vengono definite con un punto interrogativo (?) e "matchano" qualsiasi tipo di nodo (risorsa o valore letterale) all'interno del dataset RDF.
* I pattern definiti nella query sono effettivamente delle triple, eccetto per il fatto che una parte di questa triple viene rimpiazzata da una variable.
* La clausola SELECT consente di ottenere una tabella con i valori che soddisfano le richieste della query.

### Query #2 Pattern multipli e attraversamento del grafo

```
SELECT ?movie ?distributor
WHERE {
    ?movie <http://dbpedia.org/ontology/director> <http://dbpedia.org/resource/Stanley_Kubrick> .
    ?movie <http://dbpedia.org/property/distributor> ?distributor .
}
```

* [Endpoint](http://dbpedia.org/sparql)
* [Risultato dall'endpoint](http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3Fmovie+%3Fdistributor%0D%0AWHERE+%7B%0D%0A++++%3Fmovie+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fdirector%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FStanley_Kubrick%3E+.%0D%0A++++%3Fmovie+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2Fdistributor%3E+%3Fdistributor+.%0D%0A%7D&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on)

#### Tips
* In questo caso la risorsa  <http://dbpedia.org/resource/Stanley_Kubrick> non è il soggetto, ma è l'oggetto dell'asserzione. Cosa sarebbe accaduto se avessi invertito il soggetto e l'oggetto?
* All'interno del dataset non esiste un collegamento esplicito tra Stanley Kubrick e le case di distribuzione cinematografica con cui ha lavorato, ma lo posso ricavare dall'attraversamento del grafo.
* Quando vi sono più asserzioni occorre inserire un punto alla fine di ogni tripla.

## Modificatori e filtri in SPARQL
[TODO]

### Modificatori: riorganizzare la risposta di una query
Tra i modificatori che possono essere utilizzati in SPARQL per riorganizzare le risposte di una query vi sono:

* **DISTINCT**. Elimina le righe duplicate ottenute tramite una specifica query.
* **LIMIT**. Limita il numero di righe che costituiscono la risposta ad una query.
* **OFFSET**. Consente di recuperare una "fetta" (*slice*) della risposta a partire da una riga specifica. E' utile soprattutto per il *paging* e per gestire il comportamento di default degli endpoint SPARQL che erogano al massimo 10.000 righe per ogni risposta.
* **ORDER BY**. Riordina le righe della risposta ad una query sulla base di una o più variabili. L'ordinamento può essere ascendente o discendente.

``` 
SELECT DISTINCT ?director ?directorLabel
WHERE {
    ?movie <http://dbpedia.org/ontology/director> ?director .
    ?director rdfs:label ?directorLabel .
} ORDER BY ASC(?directorLabel) LIMIT 50 OFFSET 200
```

#### Proposta di esercizio
Provate ad eseguire la query sull'endpoint http://dbpedia.org/sparql e modificarla così come proposto di seguito, verificando se la risposta si modifica secondo ciò che vi aspettate.

1. Che cosa accade se rimuovo il modificatore DISTINCT? Perché secondo voi la risposta viene replicata? Per capirlo meglio, provate ad aggiungere la variabile *?movie* nella clausola SELECT della query: *SELECT ?movie ?director ?directorLabel*.
2. Che cosa accade cambiando il valore di LIMIT?
3. Osservate che cosa accade definendo un OFFSET pari a 210.
4. Che cosa accade rimuovendo dalla query la clausola ORDER BY ASC(?directorLabel). Cosa notate? Perché sembra che i concetti vengano replicati su più righe nonostante la parola chiave DISTINCT.

Per ovviare al problema che si verifica nel punto 4, è necessario introdurre il concetto dei filtri.

### Filtri: individuare sottoinsiemi di risultati
Attraverso la parola chiave **FILTER** è possibile stabilire una condizione booleana tramite la quale rimuovere specifiche righe che non mi interessano.

Riprendiamo una query simile alla precedente:

```
SELECT DISTINCT ?director ?directorLabel
WHERE {
    ?movie <http://dbpedia.org/ontology/director> ?director .
    ?director rdfs:label ?directorLabel .
} LIMIT 50
```

Proviamo ad aggiungere un filtro sulla lingua e verificare il risultato:

```
SELECT DISTINCT ?director ?directorLabel
WHERE {
    ?movie <http://dbpedia.org/ontology/director> ?director .
    ?director rdfs:label ?directorLabel .
    FILTER (langMatches(lang(?directorLabel), "EN")) .
} LIMIT 50
```

I filtri che sono a disposizione per effettuare le query SPARQL possono essere di diversa natura:
* **Logici**: !, &&, ||
* **Matematici**: +, -, *, /
* **Comparazione**: =, !=, >, <, ...
* **Test**: isURI, isBlank, isLiteral, bound
* **Di accesso**: str, lang, datatype
* **Altri**: sameTerm, langMatches, regex

## Requisiti opzionali all'interno delle query

Il risultato di una query SPARQL deve soddisfare tutti i pattern di triple che vengono definiti dal costrutto WHERE. Tuttavia, alcuni pattern possono essere resi opzionali e dunque non devono essere necessariamente soddisfatti all'interno del risultato della query.

Osserva il risultato che si ottiene con le seguenti query:

```
SELECT DISTINCT ?director ?directorLabel ?quote
WHERE {
    ?movie <http://dbpedia.org/ontology/director> ?director .
    ?director rdfs:label ?directorLabel .
    ?director <http://dbpedia.org/property/quote> ?quote . 
    FILTER (langMatches(lang(?directorLabel), "EN")) .
}

```

* [Endpoint](http://dbpedia.org/sparql)
* [Risultato dall'endpoint](http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+DISTINCT+%3Fdirector+%3FdirectorLabel+%3Fquote%0D%0AWHERE+%7B%0D%0A++++%3Fmovie+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fdirector%3E+%3Fdirector+.%0D%0A++++%3Fdirector+rdfs%3Alabel+%3FdirectorLabel+.%0D%0A++++%3Fdirector+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2Fquote%3E+%3Fquote+.+%0D%0A++++FILTER+%28langMatches%28lang%28%3FdirectorLabel%29%2C+%22EN%22%29%29+.%0D%0A%7D%0D%0A&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on)

```
SELECT DISTINCT ?director ?directorLabel ?quote
WHERE {
    ?movie <http://dbpedia.org/ontology/director> ?director .
    ?director rdfs:label ?directorLabel .
    OPTIONAL {?director <http://dbpedia.org/property/quote> ?quote} . 
    FILTER (langMatches(lang(?directorLabel), "EN")) .
}
```

* [Endpoint](http://dbpedia.org/sparql)
* [Risultato dall'endpoint](http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+DISTINCT+%3Fdirector+%3FdirectorLabel+%3Fquote%0D%0AWHERE+%7B%0D%0A++++%3Fmovie+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fdirector%3E+%3Fdirector+.%0D%0A++++%3Fdirector+rdfs%3Alabel+%3FdirectorLabel+.%0D%0A++++OPTIONAL+%7B%3Fdirector+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2Fquote%3E+%3Fquote%7D+.+%0D%0A++++FILTER+%28langMatches%28lang%28%3FdirectorLabel%29%2C+%22EN%22%29%29+.%0D%0A%7D%0D%0A&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on)
 
## Costrutti in SPARQL: ASK, DESCRIBE, CONSTRUCT

## Query avanzate

### Negazione in una query SPARQL

### SUM e COUNT

### Query federate: combinare dati provenienti da diversi endpoint

## Contatti
