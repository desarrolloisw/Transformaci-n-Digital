import { hashPassword } from '../src/config/bcrypt.config.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Crear tipos de usuario
    const [adminType, userType, guestType] = await Promise.all([
        prisma.userType.create({ data: { name: 'Administrador' } }),
        prisma.userType.create({ data: { name: 'Usuario' } }),
        prisma.userType.create({ data: { name: 'Invitado' } }),
    ]);

    // Crear usuario admin
    const adminUser = await prisma.user.create({
        data: {
            username: 'admin',
            name: 'Administrador',
            lastName: 'del',
            secondLastName: 'Sistema',
            email: 'admin@unison.mx',
            password: await hashPassword('admin123'),
            userTypeId: adminType.id,
        }
    });

    // Crear procesos
    const [servicioSocial, practicas] = await Promise.all([
        prisma.process.create({
            data: {
                name: 'Servicio Social',
                description: 'El Servicio Social es una actividad temporal y obligatoria...',
                userId: adminUser.id,
            }
        }),
        prisma.process.create({
            data: {
                name: 'Prácticas Profesionales',
                description: 'Las prácticas profesionales son actividades curriculares...',
                userId: adminUser.id,
            }
        }),
    ]);

    // Crear categorías
    const categoriesData = [
        { name: 'Información general', description: 'Descripción del proceso.' },
        { name: 'Requisitos', description: 'Requisitos necesarios.' },
        { name: 'Documentos necesarios', description: 'Documentos requeridos.' },
        { name: 'Proceso de Inscripción', description: 'Cómo inscribirse.' },
        { name: 'Seguimiento y entrega de reporte', description: 'Seguimiento y reportes.' },
        { name: 'Contacto con coordinador', description: 'Información de contacto.' }
    ];

    const categories = [];
    for (const cat of categoriesData) {
        categories.push(await prisma.category.create({
            data: {
                ...cat,
                userId: adminUser.id,
            }
        }));
    }

    // Crear FAQs (ProcessCategory)
    for (const process of [servicioSocial, practicas]) {
        for (const category of categories) {
            await prisma.processCategory.create({
                data: {
                    processId: process.id,
                    categoryId: category.id,
                    userId: adminUser.id,
                    response: `Respuesta de ejemplo para ${process.name} - ${category.name}`,
                }
            });
        }
    }

    console.log('Datos iniciales creados exitosamente');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });