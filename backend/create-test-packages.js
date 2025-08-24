import { q } from './config/db.js';

const createTestPackages = async () => {
  try {
    console.log('🔧 Creando paquetes de prueba...');
    
    const packages = [
      {
        title: 'Roma Clásica',
        description: 'Descubre la ciudad eterna con nuestro tour completo',
        destination: 'Roma, Italia',
        price: 299.99,
        duration_days: 4,
        max_participants: 20,
        image_url: '/src/assets/img/rome.jpg',
        category: 'cultural',
        start_date: '2025-09-01',
        end_date: '2025-12-31',
        organizer_id: 1
      },
      {
        title: 'Costa Amalfitana',
        description: 'Relájate en la hermosa costa italiana',
        destination: 'Amalfi, Italia',
        price: 599.99,
        duration_days: 7,
        max_participants: 15,
        image_url: '/src/assets/img/amalfi.jpg',
        category: 'beach',
        start_date: '2025-09-01',
        end_date: '2025-12-31',
        organizer_id: 1
      },
      {
        title: 'Toscana y Vinos',
        description: 'Experiencia gastronómica en la Toscana',
        destination: 'Toscana, Italia',
        price: 450.99,
        duration_days: 5,
        max_participants: 12,
        image_url: '/src/assets/img/tuscany.jpg',
        category: 'adventure',
        start_date: '2025-09-01',
        end_date: '2025-12-31',
        organizer_id: 1
      }
    ];

    for (const pkg of packages) {
      const result = await q(
        `INSERT INTO packages 
        (title, description, destination, price, duration_days, max_participants, 
         image_url, category, start_date, end_date, organizer_id, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true) 
        RETURNING id, title, price`,
        [pkg.title, pkg.description, pkg.destination, pkg.price, pkg.duration_days,
         pkg.max_participants, pkg.image_url, pkg.category, pkg.start_date, 
         pkg.end_date, pkg.organizer_id]
      );
      
      console.log(`✅ Creado: ${result.rows[0].title} (ID: ${result.rows[0].id})`);
    }

    console.log('🎉 Paquetes de prueba creados exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando paquetes:', error);
    process.exit(1);
  }
};

createTestPackages();
