export const EVENT_TAGS = {
  VIRTUAL: {
    name: 'virtual',
    description: 'Evento que se juega en línea',
  },
  IN_PERSON: {
    name: 'presencial',
    description: 'Evento que se juega presenciales',
  },
  HAS_PRIZE: {
    name: 'tiene premio',
    description: 'El evento tiene premio económico o físico',
  },
  NO_PRIZE: {
    name: 'sin premio',
    description: 'El evento no ofrece premio',
  },
} as const;
