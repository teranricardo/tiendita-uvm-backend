import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de La Tiendita UVM',
      version: '1.0.0',
      description: 'Documentación de la API para gestionar usuarios, productos y categorías',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor local',
      },
    ],
    components: {
      schemas: {
        Category: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nombre único de la categoría',
            },
            description: {
              type: 'string',
              description: 'Descripción de la categoría',
            },
          },
          required: ['name', 'description'],
        },
        Product: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nombre único del producto',
            },
            description: {
              type: 'string',
              description: 'Descripción del producto',
            },
            price: {
              type: 'number',
              description: 'Precio del producto',
            },
            image: {
              type: 'string',
              description: 'URL de la imagen del producto',
            },
            category_id: {
              type: 'string',
              description: 'ID de la categoría asociada',
            },
          },
          required: ['name', 'description', 'price', 'category_id'],
        },
        User: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nombre del usuario',
            },
            username: {
              type: 'string',
              description: 'Nombre de usuario único',
            },
            password: {
              type: 'string',
              description: 'Contraseña del usuario',
            },
            role: {
              type: 'string',
              enum: ['admin', 'editor'],
              description: 'Rol del usuario (admin o editor)',
            },
            profile_image: {
              type: 'string',
              description: 'URL de la imagen de perfil del usuario',
            },
          },
          required: ['name', 'username', 'password', 'role'],
        },
      },
    },
  },
  apis: ['src/routes/category.routes.js', 'src/routes/product.routes.js', 'src/routes/user.routes.js'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);