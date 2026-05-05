import swaggerJsdoc from 'swagger-jsdoc'
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import { registry } from './swagger-registry.js'

export function createSwaggerSpec() {
  const generator = new OpenApiGeneratorV3(registry.definitions)
  const zodSpecs = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Okizeme API',
      version: '1.0.0',
      description: 'API con validación Zod y MikroORM',
    },
    servers: [{ url: '/api' }],
  })

  const jsdocOptions = {
    definition: zodSpecs, 
    apis: [
    './src/**/*.routes.ts', 
    './dist/**/*.routes.js'
    ],
  }

  return swaggerJsdoc(jsdocOptions)
}