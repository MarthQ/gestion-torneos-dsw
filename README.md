# Gestion-Torneos-dsw

## Grupo

### Integrantes

51657 - Quagliardi, Martín Nicolás.

50937 - Urquiza, Nicolás.

51079 - Regodesebes, Mateo Ariel

48128 - Socolsky, José

### Repositorio

[_Repositorio con backend y frontend_](https://github.com/MarthQ/gestion-torneos-dsw)

## Tema

### Descripción

La propuesta consiste en desarrollar una aplicación web que habilite a los usuarios crear y organizar torneos relacionados a videojuegos competitivos, permitiendo la inscripción de los participantes a los eventos y la creación automática de las llaves correspondientes justo antes de la realización del torneo. También permitirá mostrar una imagen generada automáticamente que presente los puestos finales del torneo.
Inicialmente, los torneos se limitan a juegos con un único ganador por partida, por lo tanto, no se admitirá la participación de grupos. En su lugar, los jugadores se inscribirán de manera individual.

## Modelo

Se detallan las clases que están presentes en el trabajo. Se denotan, anteponiendo la palabra "Bracket" en el nombre, a aquellas clases que surgen de la integración con [BracketManager](https://github.com/Drarig29/brackets-manager.js/). Si bien no es adecuado que, siendo la base de datos MySQL (relacional), se guarden tipos de datos json, ya teniamos definido MySQL como base de datos previo a tener la necesidad de usar BracketManager.

### Visualización del DER en Mermaid

```mermaid
erDiagram

Usuario {
int id PK
string name "unique"
string password "hashed"
string mail "unique"
int location FK
int rol FK
}

Localidad {
int id PK
string name "unique"
}

Región {
int id PK
string name "unique"
}

Rol {
int id PK
string name "unique"
}

Juego {
int id PK
string name "unique"
text description
string imgUrl
int igdbId "unique"
}

Torneo {
int id PK
string name "unique"
string description
datetime datetimeinit
string status
int maxParticipants
int creator FK
int location FK
int region FK "nullable"
int game FK
}

Tag {
int id PK
string name "unique"
string description
}

Inscripcion {
int id PK
string nickname
datetime inscriptionDate
int points
int torneo FK
int usuario FK
}

BracketStage {
int tournament_id PK
string name
string type
int number
json settings
}

BracketGroup {
int number PK
int stage_id FK
}

BracketRound {
int number PK
int stage_id FK
int group_id FK
}

BracketMatch {
int status
json opponent1 "nullable"
json opponent2 "nullable"
int stage_id FK
int group_id FK
int round_id FK
int number
int child_count
}

BracketMatchGame {
json opponent1 "nullable"
json opponent2 "nullable"
int parent_id FK "BracketMatch"
int stage_id FK
int status
int number
}

BracketParticipant {
string name
int tournament_id FK
}

    Usuario }|--|| Rol: Tiene
    Usuario ||--o{ Torneo: Crea
    Usuario }o--|| Localidad: Pertenece
    Usuario ||--o{ Inscripcion: Realiza

    Inscripcion }o--|| Torneo: a

    Torneo }|--|| Juego: Tiene
    Torneo }o--|| Localidad: "Se encuentra"
    Torneo }o--o| Región: "Se encuentra"

    Tag }o--o{ Torneo: Posee

    %% Relaciones de Bracket (jerarquía real implementada)
    Torneo ||--|| BracketStage: "Necesario para BracketManager"
    Torneo ||--o{ BracketParticipant: "Tiene participantes"
    BracketStage ||--o{ BracketGroup: "Tiene grupos"
    BracketStage ||--o{ BracketRound: "Tiene rondas"
    BracketStage ||--o{ BracketMatch: "Tiene partidos"
    BracketGroup ||--o{ BracketRound: "Tiene rondas"
    BracketGroup ||--o{ BracketMatch: "Tiene partidos"
    BracketRound ||--o{ BracketMatch: "Tiene partidos"
    BracketMatch ||--o{ BracketMatchGame: "Tiene juegos"
    BracketMatch }o--o{ BracketParticipant: "Participantes"


```

## Alcance funcional

### Alcance minimo

_Regularidad:_
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Localidad<br>2. CRUD Roles<br>3. CRUD Juego|
|CRUD dependiente|1. CRUD de Usuario {depende de} CRUD Localidades<br>2. CRUD Torneos {depende de} CRUD Juego|
|Listado<br>+<br>detalle| 1. Podio de cada Torneo ordenado por Puntaje/Posición => Detalle: Nickname y el nombre asociado<br>2. Listado de Torneos filtrado por juego, tag, estado y nombre => Detalle: Fecha|
|CUU/Epic|1. Creacion de Torneo<br>2. Inscribir usuario a torneo|

_Adicionales para Aprobación:_
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuarios<br>2. CRUD Juegos<br>3. CRUD Localidades<br>4. CRUD Torneos<br>5. CRUD Regiones<br>6. CRUD Tag <br>7. CRUD Roles|
|CUU/Epic|1. Creacion de Torneo<br>2. Inscribir usuario a torneo.<br>3. Generar llave de torneo.|

### Alcance Adicional Voluntario

| Req      | Detalle                                                                                                                                                         |
| :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Listados | - Listado de Participantes por Torneo (con estado de inscripción)<br>- Listado de Torneos filtrado por Creador(Ordenado por fecha)                              |
| CUU/Epic | - Gestionar Perfil de Usuario<br> - Recuperar Contraseña<br>- Actualización en tiempo real de resultados de un match<br>- Regeneración de llave para randomizar |
| Otros    | - Generar podio para los puestos de cada torneo cuando este finaliza                                                                                            |
