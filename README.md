# Logbook F.I.P.S.A.S

A template system for you diving logs.

Suppoted formats:

*   [DivingLog][divinglog] XLM Export

Supported templates:

*   [logbook F.I.P.S.A.S.][fipsas] Nettuno

## Installazione

## Utilizzo

1.  Esportate da DivingLog le vostre immersione in un file xml
2.  da un terminale lanciate

    ```sh
    tofipsas <file>

    # tofipsas diving.xml
    ```

Verrà creato un file index.html contenente tutto il necessario nella cartella corrente.

Per ulteriori parametri lanciare

```sh
tofipsas --help
```

[divinglog]: http://divinglog.de/
[fipsas]: http://www.fipsas.it/didattica/didattica-subacquea/documenti-didattica-subacquea/logbook
[node]: https://nodejs.org

# Stampa

1.  Stampare il html in pdf senza margini
2.  Per stampare il PDF scegliere il formato di carta A5 e impostare la scala al 100%
3.  Stampare solo i fogli dispari, girare e quindi i fogli pari.
    ![print conf](docs/conf_print.png)

# Todo rust:

1.  css and images
2.  empty option
3.  convert doc in english

# Changelog

*   1.2.0 - L'opzione `--empty` stampa una schedina vuota
*   1.1.0 - `--dest` options specifies a folder to collect output.
