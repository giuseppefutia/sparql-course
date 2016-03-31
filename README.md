# SPARQL 
All'interno di questo repository viene fornita un'introduzione a SPARQL, protocollo e linguaggio di query per dati pubblicati ed esposti secondo il modello RDF. 

Per proporre modifiche ed arricchire questo repository potete utilizzare il [meccanismo delle pull-request offerto da GitHub](https://help.github.com/articles/using-pull-requests/).

## Architettura ed endpoint SPARQL
* Le query SPARQL vengono eseguite su dataset pubblicati secondo il modello RDF. 
* Un endpoint SPARQL è in grado di accettare ed eseguire query i cui risultati sono disponibili via HTTP.
    * A seconda delle impostazioni definite sugli endpoint, è possibile interrogare e combinare tra loro dati appartenenti a dataset differenti.
* I risultati di una query SPARQL possono essere "renderizzati" secondo diversi formati.
    * **XML**. SPARQL prevede uno specifico vocabolario per ottenere i risultati sotto forma di tabelle.
    * **JSON**. Questo formato consiste in un *porting* del vocabolario XML definito in SPARQL. Recentemente si sta affermando un formato chiamato [JSON-LD](http://json-ld.org/), che risulta molto più leggibile per gli esseri umani e si presta ad essere facilmente utilizzabile nell'ambito di servizi REST e per importare dati in NoSQL database.
    * **RDF**. Attraverso query di tipo CONSTRUCT si ottengo dati in RDF, serializzabili in diversi formati (RDF/XML, N-Triples, Turtle, ecc.).
    * **HTML**. Utilizzato in particolar modo nel caso in cui le query SPARQL vengano gestite tramite un form. In genere la risposta in formato HTML viene implementata applicando un XLS per trasformare i risultatconi dal formato XML.

## Struttura base di una query SPARQL
Una query SPARQL prevede nell'ordine:

* Dichiarazione dei prefissi per poter abbreviare gli URI all'interno della query.
* Specificazione del grafo RDF sul quale eseguire la query (non strettamente necessario nel caso in cui si volessero interrogare tutti i dati pubblicati sull'endpoint).
* Definizione dei risultati che voglio ottenere con una query SPARQL.
* Costruzione della query per individuare informazioni specifiche contenute all'interno del dataset. 
* Inserimento di modificatori per riorganizzare, suddividere e riordinare il risultato della query.

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
* DBpedia ([sito del progetto](http://dbpedia.org/), [endpoint SPARQL](http://dbpedia.org/sparql)).
* DBpedia Italia ([sito del progetto](http://it.dbpedia.org/), [endpoint SPARQL](http://it.dbpedia.org/sparql)).

DBpedia è un progetto che ha l'obiettivo di pubblicare secondo il modello RDF le informazioni provenienti da  Wikipedia. DBpedia include dati estratti in automatico dalle infobox, dalla gerarchia di categorie, dagli abstract degli articoli e da fonti esterne.

## Identificazioni di pattern all'interno di dati RDF

### Clausola SELECT, variabili e pattern di triple
All'interno del dataset DBPedia identifica la label (ovvero la stringa "human readable") che si riferisce alla risorsa http://dbpedia.org/page/Stanley_Kubrick. Generalmente le label sono associate alle risorse tramite il predicato *rdfs:label*  

```
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?label
WHERE {
   <http://dbpedia.org/resource/Stanley_Kubrick> rdfs:label ?label
}
```

* [Risultato della query](http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Flabel%0D%0AWHERE+%7B%0D%0A+++%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FStanley_Kubrick%3E+rdfs%3Alabel+%3Flabel+.%0D%0A%7D&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on)

#### Tips
* In SPARQL le variabili vengono definite con un punto interrogativo (?) e includono qualsiasi tipo di nodo (risorsa o valore letterale) all'interno del dataset RDF.
* I pattern definiti nella query sono triple in cui uno o più elementi vengono rimpiazzati da una variable.
* La clausola SELECT consente di ottenere una tabella con i valori che soddisfano le richieste della query.

#### Proposta di esercizio
* Provate ad individuare tutte le proprietà, e il valore di tali proprietà, che sono collegate alla risorsa <http://dbpedia.org/resource/Stanley_Kubrick>.

### Pattern multipli e attraversamento del grafo

```
SELECT ?movie ?distributor
WHERE {
    ?movie <http://dbpedia.org/ontology/director> <http://dbpedia.org/resource/Stanley_Kubrick> .
    ?movie <http://dbpedia.org/property/distributor> ?distributor .
}
```

* [Risultato della query](http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3Fmovie+%3Fdistributor%0D%0AWHERE+%7B%0D%0A++++%3Fmovie+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fdirector%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FStanley_Kubrick%3E+.%0D%0A++++%3Fmovie+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2Fdistributor%3E+%3Fdistributor+.%0D%0A%7D&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on)

#### Tips
* In questo caso la risorsa  <http://dbpedia.org/resource/Stanley_Kubrick> non è il soggetto, ma è l'oggetto dell'asserzione. Cosa sarebbe accaduto se avessi invertito il soggetto e l'oggetto?
* All'interno del dataset non esiste un collegamento esplicito tra Stanley Kubrick e le case di distribuzione cinematografica con cui ha lavorato, ma lo posso ricavare dall'attraversamento del grafo.
* Quando vi sono più asserzioni occorre inserire un punto alla fine di ogni tripla.

#### Proposta di esercizio
* Provate ad aggiungere alla query precedente gli elementi necessari per individuare i fondatori e la data di fondazione della casa di distribuzione.

## Modificatori e filtri in SPARQL

### Modificatori: riorganizzare la risposta di una query
Tra i modificatori che possono essere utilizzati in SPARQL per riorganizzare le risposte di una query vi sono:

* **DISTINCT**. Elimina le occorrenze duplicate di uno o più parametri ottenute tramite una specifica query.
* **LIMIT**. Limita il numero di righe che costituiscono la risposta ad una query.
* **OFFSET**. Consente di recuperare una "fetta" (*slice*) della risposta a partire da una riga specifica. E' utile soprattutto per il "paging" e per gestire il comportamento di default degli endpoint SPARQL che erogano al massimo 10.000 righe per ogni risposta.
* **ORDER BY**. Riordina le righe della risposta ad una query sulla base di una o più variabili. L'ordinamento può essere ascendente o discendente.

``` 
SELECT DISTINCT ?director ?directorLabel
WHERE {
    ?movie <http://dbpedia.org/ontology/director> ?director .
    ?director rdfs:label ?directorLabel .
} ORDER BY ASC(?directorLabel) LIMIT 50 OFFSET 200
```

* [Risultato della query](http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+DISTINCT+%3Fdirector+%3FdirectorLabel%0D%0AWHERE+%7B%0D%0A++++%3Fmovie+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fdirector%3E+%3Fdirector+.%0D%0A++++%3Fdirector+rdfs%3Alabel+%3FdirectorLabel+.%0D%0A%7D+ORDER+BY+ASC%28%3FdirectorLabel%29+LIMIT+50+OFFSET+200&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on)

#### Proposta di esercizio
Provate ad eseguire la query sull'endpoint http://dbpedia.org/sparql e modificarla così come proposto di seguito, verificando se la risposta si modifica secondo ciò che vi aspettate.

1. Che cosa accade se rimuovo il modificatore DISTINCT? Perché secondo voi la risposta viene replicata? Per capirlo meglio, provate ad aggiungere la variabile *?movie* nella clausola SELECT della query: *SELECT ?movie ?director ?directorLabel*.
2. Che cosa accade cambiando il valore di LIMIT?
3. Osservate che cosa accade definendo un OFFSET pari a 210.
4. Inserite nuovamente il modificatore DISTINCT e rimuovete dalla query la clausola ORDER BY ASC(?directorLabel). Cosa notate? Perché sembra che i concetti vengano replicati su più righe nonostante la parola chiave DISTINCT.

Per ovviare al problema che si verifica nel punto 4, è necessario introdurre il concetto dei filtri.

### Filtri: individuare sottoinsiemi di risultati
Attraverso la parola chiave **FILTER** è possibile stabilire una condizione booleana tramite la quale filtrare i risultati presenti all'interno della risposta.

Riprendiamo una query simile alla precedente:

```
SELECT DISTINCT ?director ?directorLabel
WHERE {
    ?movie <http://dbpedia.org/ontology/director> ?director .
    ?director rdfs:label ?directorLabel .
} LIMIT 50
```

* [Risultato della query](http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=%0D%0ASELECT+DISTINCT+%3Fdirector+%3FdirectorLabel%0D%0AWHERE+%7B%0D%0A++++%3Fmovie+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fdirector%3E+%3Fdirector+.%0D%0A++++%3Fdirector+rdfs%3Alabel+%3FdirectorLabel+.%0D%0A%7D+LIMIT+50%0D%0A&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on)

Proviamo ad aggiungere un filtro sulla lingua e verificare il risultato:

```
SELECT DISTINCT ?director ?directorLabel
WHERE {
    ?movie <http://dbpedia.org/ontology/director> ?director .
    ?director rdfs:label ?directorLabel .
    FILTER (langMatches(lang(?directorLabel), "EN")) .
} LIMIT 50
```

* [Risultato della query](http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=%0D%0ASELECT+DISTINCT+%3Fdirector+%3FdirectorLabel%0D%0AWHERE+%7B%0D%0A++++%3Fmovie+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fdirector%3E+%3Fdirector+.%0D%0A++++%3Fdirector+rdfs%3Alabel+%3FdirectorLabel+.%0D%0A%7D+LIMIT+50%0D%0A&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on)

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

* [Risultato della query](http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+DISTINCT+%3Fdirector+%3FdirectorLabel+%3Fquote%0D%0AWHERE+%7B%0D%0A++++%3Fmovie+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fdirector%3E+%3Fdirector+.%0D%0A++++%3Fdirector+rdfs%3Alabel+%3FdirectorLabel+.%0D%0A++++%3Fdirector+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2Fquote%3E+%3Fquote+.+%0D%0A++++FILTER+%28langMatches%28lang%28%3FdirectorLabel%29%2C+%22EN%22%29%29+.%0D%0A%7D%0D%0A&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on)

```
SELECT DISTINCT ?director ?directorLabel ?quote
WHERE {
    ?movie <http://dbpedia.org/ontology/director> ?director .
    ?director rdfs:label ?directorLabel .
    OPTIONAL {?director <http://dbpedia.org/property/quote> ?quote} . 
    FILTER (langMatches(lang(?directorLabel), "EN")) .
}
```

* [Risultato della query](http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+DISTINCT+%3Fdirector+%3FdirectorLabel+%3Fquote%0D%0AWHERE+%7B%0D%0A++++%3Fmovie+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fdirector%3E+%3Fdirector+.%0D%0A++++%3Fdirector+rdfs%3Alabel+%3FdirectorLabel+.%0D%0A++++OPTIONAL+%7B%3Fdirector+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2Fquote%3E+%3Fquote%7D+.+%0D%0A++++FILTER+%28langMatches%28lang%28%3FdirectorLabel%29%2C+%22EN%22%29%29+.%0D%0A%7D%0D%0A&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on)

### Proposta di esercizio
* Per ogni regista, individuare anche i film di cui è stato produttore come parametro opzionale.
 
## ASK, DESCRIBE, CONSTRUCT
Oltre alla clausola SELECT è possibile specificare altre parole chiave a seconda del risultato che vogliamo ottenere con la nostra query.

### ASK
Consente di ottenere una risposta booleana a partire dalla query specificata.

```
ASK
WHERE {
   <http://dbpedia.org/resource/Quentin_Tarantino> <http://dbpedia.org/ontology/birthDate> ?qtBirthDate .
   <http://dbpedia.org/resource/Stanley_Kubrick> <http://dbpedia.org/ontology/birthDate> ?skBirthDate .
   FILTER(?skBirthDate < ?qtBirthDate) .
}
```
* [Risultato della query](http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=ASK%0D%0AWHERE+%7B%0D%0A+++%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FQuentin_Tarantino%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FbirthDate%3E+%3FqtBirthDate+.%0D%0A+++%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FStanley_Kubrick%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FbirthDate%3E+%3FskBirthDate+.%0D%0A+++FILTER%28%3FskBirthDate+%3C+%3FqtBirthDate%29+.%0D%0A%7D&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on)

### DESCRIBE
Consente di ottenere come risultato un RDF che descrive le risorse specificate. Il server è libero di interpretare una DESCRIBE secondo la propria implementazione, per questi motivi query eseguite su endpoint differenti non sono necessariamente interoperabili. 

```
DESCRIBE ?movie {
   ?movie <http://dbpedia.org/ontology/director> <http://dbpedia.org/resource/Stanley_Kubrick> .
}
```
* [Risultato della query](http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=%0D%0A%0D%0ADESCRIBE+%3Fmovie+%7B%0D%0A+++%3Fmovie+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fdirector%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FStanley_Kubrick%3E+.%0D%0A%7D&format=text%2Fturtle&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on)

#### Tips
* Nel caso in cui non venga definito un prefisso in maniera esplicita, l'endpoint stesso lo crea in automatico utilizzando l'espressione ns\*(namespace + un numero).

### CONSTRUCT
A differenza della clausola SELECT che consente di ottenere una tabella con all'interno dei risultati, attraverso una query CONSTRUCT si ottiene un grafo RDF. Tale grafo viene costruito prelevando i dati di interesse tramite una query "tradizionale" ed utilizzando i risultati ottenuti per completare il template definito dalla query CONSTRUCT.

Negli esempi precedenti abbiamo visto come la risorsa http://dbpedia.org/resource/Stanley_Kubrick non fosse direttamente collegata alle case di distribuzione dei suoi film. Per questi motivi, potrei creare un grafo in cui rendo esplicito questo collegamento tramite una query CONSTRUCT.

```
PREFIX mo: <http://myontology.org/>

CONSTRUCT { 
  <http://dbpedia.org/resource/Stanley_Kubrick> mo:workWithDistributor ?distributor .
}
WHERE { 
    ?movie <http://dbpedia.org/ontology/director> <http://dbpedia.org/resource/Stanley_Kubrick> .
    ?movie <http://dbpedia.org/property/distributor> ?distributor .
}
```
* [Risultato della query](http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+mo%3A+%3Chttp%3A%2F%2Fmyontology.org%2F%3E%0D%0A%0D%0ACONSTRUCT+%7B+%0D%0A++%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FStanley_Kubrick%3E+mo%3AworkWithDistributor+%3Fdistributor+.%0D%0A%7D%0D%0AWHERE+%7B+%0D%0A++++%3Fmovie+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fdirector%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FStanley_Kubrick%3E+.%0D%0A++++%3Fmovie+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2Fdistributor%3E+%3Fdistributor+.%0D%0A%7D&format=text%2Fturtle&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on)

#### Tips
* In questo caso ho costruito una proprietà che non esisteva in precedenza per definire una nuova asserzione.
* Il grafo ottenuto tramite la query CONSTRUCT è creato in locale e dunque non vengono effettivamente pubblicate nuove triple sull'endpoint.

#### Proposta di esercizio
Una query CONSTRUCT può essere utilizzata per modificare il vocabolario attraverso cui definire i predicati. Nel caso della risorsa http://dbpedia.org/resource/Stanley_Kubrick il nome e il cognome del regista vengono definiti in DBpedia tramite la proprietà http://xmlns.com/foaf/0.1/name. Provate ad utilizzare una query CONSTRUCT per costruire un nuovo grafo, scegliendo il predicato corretto definito nell'ontologia https://www.w3.org/TR/vcard-rdf/.

## Query avanzate
Combinando gli elementi affrontati sino ad ora è possibile costruire delle query avanzate in grado di sfruttare tutte le potenzialità di SPARQL e dei Linked Data.

### Negazione in una query SPARQL
La negazione consente di sfruttare triple esistente per filtrare il risultato. In questo caso voglio ottenere tutti i film diretti da Stanley Kubrick che hanno una casa di distribuzione diversa da quella che ha distribuito il film Blade Runner.

```
SELECT DISTINCT ?movie
WHERE {
    ?movie <http://dbpedia.org/ontology/director> <http://dbpedia.org/resource/Stanley_Kubrick> .
    ?movie <http://dbpedia.org/property/distributor> ?distributor .
    OPTIONAL {<http://dbpedia.org/resource/Blade_Runner> <http://dbpedia.org/property/distributor> ?badDistributor . FILTER (?distributor = ?badDistributor) .} .
    FILTER ( !BOUND(?badDistributor) )
}
```
* [Risultato della query](http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+DISTINCT+%3Fmovie%0D%0AWHERE+%7B%0D%0A++++%3Fmovie+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fdirector%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FStanley_Kubrick%3E+.%0D%0A++++%3Fmovie+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2Fdistributor%3E+%3Fdistributor+.%0D%0A++++OPTIONAL+%7B%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FBlade_Runner%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2Fdistributor%3E+%3FbadDistributor+.+FILTER+%28%3Fdistributor+%3D+%3FbadDistributor%29+.%7D+.%0D%0A++++FILTER+%28+%21BOUND%28%3FbadDistributor%29+%29%0D%0A%7D&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on)

#### Proposta di esercizio
* Individuare tutti i film di Stanley Kubrick in cui il compositore NON è Wendy Carlos (http://dbpedia.org/resource/Wendy_Carlos)

### SUM
Per mostrare le potenzialità di SPARQL per la gestione delle somme viene proposta una query SPARQL sul repository RDF costruito a partire dai dati dei contratti pubblici italiani (http://public-contracts.nexacenter.org/). L'enpoint SPQARQL è disponibile all'indirizzo: http://public-contracts.nexacenter.org/sparql. 

La query seguente mostra l'ammontare ricevuto nell'ambito di contratti pubblici dall'azienda identificata con la partita IVA 04145300010.

```
PREFIX pc: <http://purl.org/procurement/public-contracts#>
PREFIX payment: <http://reference.data.gov.uk/def/payment#>

SELECT SUM(?amount) as ?paidTotal ?company
WHERE {
    SELECT DISTINCT ?contract ?amount ?company
    WHERE {
        ?company <http://purl.org/goodrelations/v1#vatID> "04145300010".
        ?bid pc:bidder ?company .
        ?contract pc:awardedTender ?bid .
        ?contract payment:payment ?payment . 
        ?payment payment:netAmount ?amount .
    }
}
```
* [Risultato della query](http://public-contracts.nexacenter.org/sparql?default-graph-uri=&query=PREFIX+pc%3A+%3Chttp%3A%2F%2Fpurl.org%2Fprocurement%2Fpublic-contracts%23%3E%0D%0APREFIX+payment%3A+%3Chttp%3A%2F%2Freference.data.gov.uk%2Fdef%2Fpayment%23%3E%0D%0A%0D%0ASELECT+SUM%28%3Famount%29+as+%3FpaidTotal+%3Fcompany%0D%0AWHERE+%7B%0D%0A++++SELECT+DISTINCT+%3Fcontract+%3Famount+%3Fcompany%0D%0A++++WHERE+%7B%0D%0A++++++++%3Fcompany+%3Chttp%3A%2F%2Fpurl.org%2Fgoodrelations%2Fv1%23vatID%3E+%2204145300010%22.%0D%0A++++++++%3Fbid+pc%3Abidder+%3Fcompany+.%0D%0A++++++++%3Fcontract+pc%3AawardedTender+%3Fbid+.%0D%0A++++++++%3Fcontract+payment%3Apayment+%3Fpayment+.+%0D%0A++++++++%3Fpayment+payment%3AnetAmount+%3Famount+.%0D%0A++++%7D%0D%0A%7D&should-sponge=&format=text%2Fhtml&timeout=0&debug=on).

### Query federate: combinare dati provenienti da diversi endpoint
La potenzialità dei Linked Data risiede nel fatto che è possibile combinare tra loro dati provenienti da endpoint differenti. Ad esempio è possibile individuare la PEC di una pubblica amministrazione presente del dataset dei contratti pubblici interrogando il repository [SPCDATA](http://spcdata.digitpa.gov.it/index.html).

```
PREFIX gr:<http://purl.org/goodrelations/v1#>
PREFIX pc: <http://purl.org/procurement/public-contracts#>
PREFIX payment: <http://reference.data.gov.uk/def/payment#>
PREFIX spc: <http://spcdata.digitpa.gov.it/>

SELECT ?label SUM(?amount) as ?paidAmounts ?officialEmail
WHERE {
SELECT DISTINCT *
WHERE {
 ?contractingAutority <http://purl.org/goodrelations/v1#vatID> "00518460019".
 ?contractingAutority rdfs:label ?label.
 ?contractingAutority owl:sameAs ?uriSpc.
  SERVICE <http://spcdata.digitpa.gov.it:8899/sparql> { 
  OPTIONAL { ?uriSpc spc:PEC ?officialEmail.} 
  }
 ?contract pc:contractingAutority  ?contractingAutority.
 ?contract payment:payment ?payment.
 ?payment payment:netAmount ?amount.
} ORDER BY ?contract
} 
```
* [Risultato della query](http://public-contracts.nexacenter.org/sparql?default-graph-uri=&query=PREFIX+gr%3A%3Chttp%3A%2F%2Fpurl.org%2Fgoodrelations%2Fv1%23%3E%0D%0APREFIX+pc%3A+%3Chttp%3A%2F%2Fpurl.org%2Fprocurement%2Fpublic-contracts%23%3E%0D%0APREFIX+payment%3A+%3Chttp%3A%2F%2Freference.data.gov.uk%2Fdef%2Fpayment%23%3E%0D%0APREFIX+spc%3A+%3Chttp%3A%2F%2Fspcdata.digitpa.gov.it%2F%3E%0D%0A%0D%0ASELECT+%3Flabel+SUM%28%3Famount%29+as+%3FpaidAmounts+%3FofficialEmail%0D%0AWHERE+%7B%0D%0ASELECT+DISTINCT+*%0D%0AWHERE+%7B%0D%0A+%3FcontractingAutority+%3Chttp%3A%2F%2Fpurl.org%2Fgoodrelations%2Fv1%23vatID%3E+%2200518460019%22.%0D%0A+%3FcontractingAutority+rdfs%3Alabel+%3Flabel.%0D%0A+%3FcontractingAutority+owl%3AsameAs+%3FuriSpc.%0D%0A++SERVICE+%3Chttp%3A%2F%2Fspcdata.digitpa.gov.it%3A8899%2Fsparql%3E+%7B+%0D%0A++OPTIONAL+%7B+%3FuriSpc+spc%3APEC+%3FofficialEmail.%7D+%0D%0A++%7D%0D%0A+%3Fcontract+pc%3AcontractingAutority++%3FcontractingAutority.%0D%0A+%3Fcontract+payment%3Apayment+%3Fpayment.%0D%0A+%3Fpayment+payment%3AnetAmount+%3Famount.%0D%0A%7D+ORDER+BY+%3Fcontract%0D%0A%7D+&should-sponge=&format=text%2Fhtml&timeout=0&debug=on)


## Contatti
* Linkedin: https://it.linkedin.com/in/giuseppefutia
* Twitter: https://twitter.com/giuseppe_futia
