# Logbook templates

A template system for you diving log applications.

Suppoted formats:

*   [MacDive][macdive] XML Export
*   [DivingLog][divinglog] XML Export

Supported templates:

*   [logbook F.I.P.S.A.S.][fipsas] Nettuno

## Utilizzo

1.  Export your dives from you log application of choice in xml
2.  Launch from a terminal

    ```sh
    logtemplate <file>

    # logtemplate diving.xml
    ```

Verrà creato un file index.html contenente tutto il necessario nella cartella corrente.

Per ulteriori parametri lanciare

```sh
logtemplate --help
```

# Stampa

1.  Stampare il html in pdf senza margini
2.  Per stampare il PDF scegliere il formato di carta A5 e impostare la scala al 100%
3.  Stampare solo i fogli dispari, girare e quindi i fogli pari.
    ![print conf](docs/conf_print.png)

# Changelog

*   1.3.0 - Macdive XML export support
*   1.2.0 - Passing no INPUT file outputs an empty logbook page, useful sometimes.
*   1.1.0 - `--dest` options specifies a folder to collect output.

[divinglog]: http://divinglog.de/
[macdive]: http://www.mac-dive.com/
[fipsas]: http://www.fipsas.it/didattica/didattica-subacquea/documenti-didattica-subacquea/logbook
[node]: https://nodejs.org
