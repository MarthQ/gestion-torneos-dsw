import { ORM } from '../shared/db/orm.js'
import { Role } from '../role/role.entity.js'
import { Location } from '../location/location.entity.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'
import { EVENT_TAGS } from '../tag/interfaces/default-tags.const.js'
import { Tag } from '../tag/tag.entity.js'

const DEFAULT_ROLES = Object.values(USER_ROLE)

export async function seedRoles() {
    const em = ORM.em.fork()
    for (const name of DEFAULT_ROLES) {
        const exists = await em.findOne(Role, { name })
        if (!exists) {
            em.create(Role, { name })
        }
    }
    await em.flush()
    console.log('✅ Roles seeded')
}

const DEFAULT_TAGS = Object.values(EVENT_TAGS)
export async function seedTags() {
    const em = ORM.em.fork()
    for (const tag of DEFAULT_TAGS) {
        const exists = await em.findOne(Tag, { name: tag.name })
        if (!exists) {
            em.create(Tag, {
                name: tag.name,
                description: tag.description,
            })
        }
    }
    await em.flush()
    console.log('✅ Tags seeded')
}

// Localidades de Argentina organizadas por provincia
const ARGENTINIAN_LOCATIONS = [
    // Buenos Aires
    'La Plata',
    'Mar del Plata',
    'Bahía Blanca',
    'Tandil',
    'Pergamino',
    'Zárate',
    'Campana',
    'San Nicolás',
    'Luján',
    'Avellaneda',
    'Quilmes',
    'Berazategui',
    'Lanús',
    'Lomas de Zamora',
    'Almirante Brown',
    'Esteban Echeverría',
    'Ezeiza',
    'San Vicente',
    'Presidente Perón',
    'General Las Heras',
    'General Rodríguez',
    'Merlo',
    'Moreno',
    'Ituzaingó',
    'Hurlingham',
    'San Miguel',
    'Tigre',
    'Vicente López',
    'San Isidro',
    // Córdoba
    'Córdoba Capital',
    'Villa Carlos Paz',
    'Cosquín',
    ' Río Cuarto',
    'San Francisco',
    'Villa María',
    'Jesús María',
    'La Falda',
    'Mina Clavero',
    'Alta Gracia',
    'Bell Ville',
    'Villa Dolores',
    'Miramar',
    'Deán Funes',
    // Santa Fe
    'Rosario',
    'Santa Fe Capital',
    'Santo Tomé',
    'Rafaela',
    'Venado Tuerto',
    'Reconquista',
    'San Lorenzo',
    'Granadero Baigorria',
    'Capitán Bermúdez',
    'Funes',
    'Pérez',
    'Arroyo Seco',
    'Casilda',
    ' Cañada de Gómez',
    // Mendoza
    'Mendoza Capital',
    'Godoy Cruz',
    'Guaymallén',
    'Las Heras',
    'San Rafael',
    'Luján de Cuyo',
    'Maipú',
    'Tunuyán',
    'San Martín',
    'Rivadavia',
    'Lavalle',
    'Tupungato',
    'Santa Rosa',
    'San Carlos',
    // Tucumán
    'San Miguel de Tucumán',
    'Yerba Buena',
    'Tafí Viejo',
    'Banda del Río Salí',
    'Alderetes',
    'Concepción',
    'Monteros',
    'Simoca',
    'La Cocha',
    // Entre Ríos
    'Paraná',
    'Concordia',
    'Gualeguaychú',
    'Concepción del Uruguay',
    'La Paz',
    'Villaguay',
    'Diamante',
    'Nogoyá',
    'Victoria',
    'San Salvador',
    // Salta
    'Salta Capital',
    'San Ramón de la Nueva Orán',
    'Tartagal',
    'Cafayate',
    'Jujuy (ver nota abajo)',
    'Metán',
    'Embarcación',
    'Rivadavia',
    'Los Toldos',
    // Misiones
    'Posadas',
    'Puerto Iguazú',
    'Eldorado',
    'Oberá',
    'Apóstoles',
    'San Vicente',
    'Puerto Rico',
    'Jardín América',
    'Leandro N. Alem',
    ' Bernardo de Irigoyen',
    // Chaco
    'Resistencia',
    'Presidencia Roque Sáenz Peña',
    'Villa Ángela',
    'Castelli',
    'Juan José Castelli',
    'General San Martín',
    'Quitilipi',
    'Machagai',
    // Corrientes
    'Corrientes Capital',
    'Goya',
    'Santo Tomé',
    'Mercedes',
    'Curuzú Cuatiá',
    'Paso de los Libres',
    'Ituzaingó',
    'Mercedes',
    'Bella Vista',
    'Esquina',
    // Santiago del Estero
    'Santiago del Estero Capital',
    'La Banda',
    'Termas de Río Hondo',
    'Frías',
    'Añatuya',
    'La Clareta',
    'Monteros',
    'Icaño',
    // Jujuy
    'San Salvador de Jujuy',
    'Palpalá',
    'San Pedro',
    'La Quiaca',
    'Humahuaca',
    'Tilcara',
    'Perico',
    'Libertador General San Martín',
    'Palma Sola',
    // Río Negro
    'Viedma',
    'Bariloche',
    'Cipolletti',
    'General Roca',
    'Villa Regina',
    'San Carlos de Bariloche',
    'El Bolsón',
    'Sierra Grande',
    'Los Menucos',
    // Neuquén
    'Neuquén Capital',
    'Cipolletti',
    'Plottier',
    'Centenario',
    'Senillosa',
    'San Martín de los Andes',
    'Junín de los Andes',
    'Villa La Angostura',
    'Chos Malal',
    'Zapala',
    // Mendoza
    'San Rafael',
    'Tunuyán',
    'Uspallata',
    'Malargüe',
    'San Carlos',
    // Chubut
    'Rawson',
    'Trelew',
    'Puerto Madryn',
    'Comodoro Rivadavia',
    'Esquel',
    'Río Senguer',
    'Gobernación',
    'Sarmiento',
    'Lago Puelo',
    'El Maitén',
    // Santa Cruz
    'Río Gallegos',
    'Caleta Olivia',
    'Puerto San Julián',
    'Puerto Deseado',
    'Las Heras',
    'Gobernación Gregores',
    'Los Antiguos',
    'El Calafate',
    'Perito Moreno',
    // Tierra del Fuego
    'Ushuaia',
    'Río Grande',
    'Tolhuin',
    'Laguna Blanca',
    // La Pampa
    'Santa Rosa',
    'General Pico',
    'Toay',
    'Victorica',
    'Telén',
    'Macachín',
    'Ingeniero Luiggi',
    'Realicó',
    'Guatraché',
    'Alta Italia',
    // La Rioja
    'La Rioja Capital',
    'Chilecito',
    'Aimogasta',
    'San Juan de la Punta',
    'Chamical',
    'Chepes',
    'Villa Unión',
    'Villa Mazán',
    'Anillaco',
    // San Juan
    'San Juan Capital',
    'Rawson',
    'Chimbas',
    'Rivadavia',
    'Santa Lucía',
    'Pocito',
    'Albardón',
    'Caucete',
    'San Martín',
    '9 de Julio',
    // San Luis
    'San Luis Capital',
    'Villa Mercedes',
    'La Punta',
    'Juana Koslay',
    'Merlo',
    'Potrero de los Funes',
    'El Volcán',
    'El Trapiche',
    'Cortaderas',
    // Formosa
    'Formosa Capital',
    'Clorinda',
    'Las Lomitas',
    'Ingeniero Juárez',
    'El Colorado',
    'Pirané',
    'Fortín Lugones',
    'Ibarreta',
    'San Martín II',
    // Catamarca
    'San Fernando del Valle de Catamarca',
    'San José',
    'Santa María',
    'Andalgalá',
    ' Belén',
    'Tinogasta',
    'Fiambalá',
    'Los Altos',
    'Paclin',
    // Misiones (ampliado)
    'San Ignacio',
    'Corpus Christi',
    'Aristóbulo del Valle',
    'San Pedro',
    'Dos de Abril',
    'Mojón Grande',
    'San Antonio',
    'Puerto Esperanza',
]

export async function seedLocations() {
    const em = ORM.em.fork()
    let created = 0
    for (const name of ARGENTINIAN_LOCATIONS) {
        const exists = await em.findOne(Location, { name: name.trim() })
        if (!exists) {
            em.create(Location, { name: name.trim() })
            created++
        }
    }
    await em.flush()
    console.log(`✅ Locations seeded (${created} new)`)
}
