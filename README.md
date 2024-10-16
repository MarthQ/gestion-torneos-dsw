# Gestion-Torneos-dsw

## Grupo

### Integrantes

51657 - Quagliardi, Martín Nicolás.

50937 - Urquiza, Nicolás.

51079 - Regodesebes, Mateo Ariel

### Repositorio

[_Repositorio con backend y frontend_](https://github.com/MarthQ/gestion-torneos-dsw)

## Tema

### Descripción

La propuesta consiste en desarrollar una aplicación web que habilite a los usuarios crear y organizar torneos relacionados a videojuegos competitivos, permitiendo la inscripción de los participantes a los eventos y la creación automática de las llaves correspondientes justo antes de la realización del torneo. También permitirá mostrar una imagen generada automáticamente que presente los puestos finales del torneo.
Inicialmente, los torneos se limitan a juegos con un único ganador por partida, por lo tanto, no se admitirá la participación de grupos. En su lugar, los jugadores se inscribirán de manera individual.

## Modelo

Modelo de Dominio y DER: https://drive.google.com/file/d/1vmKh96SPnYbbzmiK3RvOFFA7i3dR8jJX/view?usp=sharing

### Visualización del DER en Mermaid

```mermaid
erDiagram
    Usuario {
        int id PK
        string nombre
        string password
        string mail
    }

    Localidad {
        string codPostal PK
        string nombre
    }

    Juego {
        int id PK
        string nombre
    }

    Tipo_Juego {
        int codigo PK
        string nombre
        string descripcion

    }

    Torneo {
        int id PK
        string name
        string description
        datetime datetimeinit
        string status
    }

    Tag {
        int id PK
        string descripcion
    }


    Inscripcion {
        int idUsuario PK,FK
        int idTorneo PK,FK
        int victorias
        int derrotas
        datetime fechahora-inscripcion
    }

    Estandar {
    }

    Moderador {}

    Permisos {
        int codperm PK
        string descripcion
    }

    Usuario }o--|| Localidad: Pertenece
    Usuario ||--o{ Inscripcion: Realiza
    Inscripcion }o--|| Torneo: a
    Torneo }|--|| Juego: Tiene
    Juego }|--|| Tipo_Juego: Pertenece
    Tag }o--o{ Tipo_Juego: Posee
    Tag }o--o{ Juego: Posee
    Tag }o--o{ Torneo: Posee
    Moderador }|--|| Permisos: Tiene
    Estandar ||--|| Usuario: "Herencia Disyunta"
    Moderador ||--|| Usuario: "Herencia Disyunta"
```

## Alcance funcional

### Alcance minimo

_Regularidad:_
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Localidad<br>2. CRUD Tipo de Torneo<br>3. CRUD Tipo de Juego|
|CRUD dependiente|1. CRUD de Usuario {depende de} CRUD Localidades<br>2. CRUD Videojuegos {depende de} CRUD Tipo de Juego|
|Listado<br>+<br>detalle| 1. Podio de cada Torneo filtrado por Puntaje/Condición de Victoria => Detalle: Localidad<br>2. Listado de Torneos filtrado por juego => Detalle: Fecha|
|CUU/Epic|1. Creacion de Torneo<br>2. Inscribir usuario a torneo|

_Adicionales para Aprobación:_
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuarios<br>2. CRUD Tipo de Torneo<br>3. CRUD Tipo de Juego<br>4. CRUD Videojuegos<br>5. CRUD Localidades<br>6. CRUD Moderador|
|CUU/Epic|1. Generar llave de torneo.<br>2. Inscribir usuario a torneo.<br>3. Creacion de Torneo|

### Alcance Adicional Voluntario

| Req      | Detalle                                                                                                                                                     |
| :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Listados | - Listado de Usuarios filtrado por Localidad (Ordenado por Puntaje/Condición de Victoria)<br>- Listado de Partidas filtrado por Jugador(Ordenado por fecha) |
| CUU/Epic | - Gestionar Perfil de Usuario<br> - Recuperar Contraseña<br>- Enviar Resultados de un Torneo<br>- Notificar Torneos próximos                                |
| Otros    | - Generar automáticamente imagen personalizada para los puestos de cada torneo (por juego)                                                                  |
