### 2.6.0 (2020-02-04)

##### Chores

*  updated examples (05fe552f)
*  cleanup of the options management (402e595b)

##### New Features

*  used the tankName property for the tanks (ff23f6df)

##### Bug Fixes

*  Fixed url downloader. (b64d3e03)

### 2.5.0 (2019-12-20)

##### Chores

*  Moved files of of the pdfkit folder (ab0303ad)

##### New Features

*  Maps when available printed on the second page (540c2bc0)

### 2.4.0 (2019-11-28)

##### Build System / Dependencies

*  better option flags management (6c7a62a9)
*  update dependencies (66318f8a)

##### New Features

*  Club logo (a17d40a8)
*  removed the old (not working) signature feature (5c243ef1)

##### Bug Fixes

*  debug squares should only work in debug mode (5e84344f)
*  package json type (7bbcdc96)
*  Fixed checks if no args passed (3d4d6329)

#### 2.3.1 (2019-11-17)

##### Bug Fixes

*  the borders in vertical stacks of inputs are no longer double (097ec337)
*  fixed build for empty pages (9924486d)

### 2.3.0 (2019-11-12)

##### Build System / Dependencies

*  added missing generate-changelog (bc67935f)
*  removed stupid scripts (83f2ae54)
*  update depencencies (4347f582)

##### Chores

*  Extracted dive enrichers to files (174c12ee)

##### New Features

*  Gears listing in ara template, second page (85245354)

### 2.2.0 (2019-10-08)

##### Build System / Dependencies

*  upgraded dependencies (516be0ca)
*  travis-ci support (5f0f3268)
*  More examples (adfe35dd)

##### Chores

*  Old mustache templates cleanup (114bac09)

##### New Features

*  Empty logbook card (5a7941e2)

##### Bug Fixes

*  build scripts (d80d7932)
*  signature shows version as last element (6c78eb31)

##### Refactors

*  Moved dives logic to an helper (52be15e2)

### 2.1.0 (2019-10-06)

##### Chores

*  Old mustache templates cleanup (114bac09)

##### New Features

*  Empty logbook card (5a7941e2)

## 2.0.0 (2019-10-01)

##### Build System / Dependencies

*  dependencies update (7c4bffaa)
*  added pdfkit and nodemon watch (3a645e12)
*  updates (a54e7c7f)
*  Conversion back to js (7dc3c107)
*  cleanup package.json (49e69a24)

##### Chores

*  Update to dive-importer v2 (dbe26f3e)
*  Moved Importer to separate independent package (5c3b2e76)

##### New Features

*  pdfkit template (d19dda40)

### 1.5.0 (2018-11-05)

##### Build System / Dependencies

*  Packages updated (77154dc7)

##### Chores

*  Added release scripts (ae6974c4)
*  Renamed template "fipsas" to "fipsas-didattica" (d2ffe479)

##### New Features

*  Template selection defaults to "fipsas-didattica" (05b34d89)

##### Bug Fixes

*  Removed border around pages (67526ce7)
*  Fixed empty logbook printing (958b92d8)
*  Improvements on fipsas-didattica (e1ff3879)

##### Code Style Changes

*  Conversione a ts (79b6e894)

#### 1.4.0 (2018-11-05)

##### Features

- Direct PDF output. the `--dest` argument now specifies the destination file.

##### Build System / Dependencies

- Packages updated (1bf4124d)

##### Bug Fixes

- template didattica (65c02cf6)

##### Code Style Changes

- Conversione a ts (df6ace3e)

#### 1.3.0

##### Features

- Macdive XML export support

#### 1.2.0

##### Features

- Passing no INPUT file outputs an empty logbook page, useful sometimes.

#### 1.1.0

##### Features

- `--dest` options specifies a folder to collect output.
