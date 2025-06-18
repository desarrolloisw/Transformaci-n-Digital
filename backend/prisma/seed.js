import { hashPassword } from '../src/config/bcrypt.config.js';
import { deterministicEncrypt } from '../src/config/crypto.config.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Seed the database with initial data for user types, admin user, processes, categories, action types, and FAQs.
 * This script uses upsert to ensure idempotency.
 * User-facing messages remain in Spanish.
 */
async function main() {
    await prisma.$transaction(async (tx) => {
        /**
         * Upsert user types
         */
        const [patType, coordType] = await Promise.all([
            tx.userType.upsert({
                where: { name: 'Personal Académico Tecnico' },
                update: {},
                create: { name: 'Personal Académico Tecnico' }
            }),
            tx.userType.upsert({
                where: { name: 'Coordinador' },
                update: {},
                create: { name: 'Coordinador' }
            })
        ]);

        /**
         * Upsert admin user
         */
        const adminUser = await tx.user.upsert({
            where: { username: 'admin' },
            update: {},
            create: {
                username: 'admin',
                name: 'Administrador',
                lastName: 'del',
                secondLastName: 'Sistema',
                email: deterministicEncrypt('admin@unison.mx'),
                password: await hashPassword('admin123'),
                userTypeId: patType.id,
            }
        });

        /**
         * Upsert processes with updated descriptions
         */
        const [servicioSocial, practicas] = await Promise.all([
            tx.process.upsert({
                where: { name: 'Servicio Social' },
                update: {
                    description: 'Es una actividad académica obligatoria y temporal que conecta al estudiante con las necesidades sociales de su entorno. A través del Servicio Social, los alumnos aplican lo aprendido en su formación para colaborar con causas comunitarias, fortaleciendo su compromiso con el desarrollo social. Forma parte de las tareas de vinculación que impulsa la Universidad de Sonora.'
                },
                create: {
                    name: 'Servicio Social',
                    description: 'Es una actividad académica obligatoria y temporal que conecta al estudiante con las necesidades sociales de su entorno. A través del Servicio Social, los alumnos aplican lo aprendido en su formación para colaborar con causas comunitarias, fortaleciendo su compromiso con el desarrollo social. Forma parte de las tareas de vinculación que impulsa la Universidad de Sonora.',
                    userId: adminUser.id,
                }
            }),
            tx.process.upsert({
                where: { name: 'Prácticas Profesionales' },
                update: {
                    description: 'Son una etapa formativa obligatoria en las licenciaturas de la Universidad de Sonora, donde el estudiante participa en actividades propias de su área profesional. Su objetivo es combinar los conocimientos adquiridos en el aula con experiencias reales del entorno laboral. De acuerdo con el Modelo Educativo 2030, equivalen a 250 horas (10 créditos) y pertenecen al eje de Formación Vocacional.'
                },
                create: {
                    name: 'Prácticas Profesionales',
                    description: 'Son una etapa formativa obligatoria en las licenciaturas de la Universidad de Sonora, donde el estudiante participa en actividades propias de su área profesional. Su objetivo es combinar los conocimientos adquiridos en el aula con experiencias reales del entorno laboral. De acuerdo con el Modelo Educativo 2030, equivalen a 250 horas (10 créditos) y pertenecen al eje de Formación Vocacional.',
                    userId: adminUser.id,
                }
            })
        ]);

        /**
         * Upsert categories
         */
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
            categories.push(
                await tx.category.upsert({
                    where: { name: cat.name },
                    update: {},
                    create: {
                        ...cat,
                        userId: adminUser.id,
                    }
                })
            );
        }

        /**
         * Upsert action types
         */
        const actionTypes = [
            { name: 'Crear' },
            { name: 'Actualizar' },
            { name: 'Deshabilitar' },
            { name: 'Habilitar' },
            { name: 'Consultar' }
        ];
        for (const action of actionTypes) {
            await tx.actionType.upsert({
                where: { name: action.name },
                update: {},
                create: {
                    name: action.name
                }
            });
        }

        /**
         * FAQ responses for each process and category
         */
        const servicioSocialRespuestas = {
            'Información general': `<p>El Servicio Social Universitario (SSU) es un requisito académico obligatorio para todos los estudiantes de licenciatura, orientado a contribuir al desarrollo social y profesional.</p>`,
            'Requisitos': `<ul><li>Haber cubierto al menos el 70% de los créditos del plan de estudios.</li><li>Asistir a la plática de inducción.</li><li>Elegir un programa o proyecto aprobado por el CISSU.</li><li>Realizar el registro y trámites con el responsable o coordinador.</li></ul>`,
            'Documentos necesarios': `<ul><li>Reporte final firmado y sellado.</li><li>Constancia de prestación de servicio social.</li><li>Constancia impresa de liberación.</li><li>Comprobante de pago de constancia y sanciones si aplica.</li></ul>`,
            'Proceso de Inscripción': `<ol><li>Cumplir con el 70% de créditos.</li><li>Asistir a la plática de inducción.</li><li>Elegir y registrar un programa o proyecto aprobado.</li><li>Realizar trámites con el coordinador o responsable.</li><li>Iniciar el servicio social en la fecha establecida.</li></ol>`,
            'Seguimiento y entrega de reporte': `<ul><li>Capturar reportes parciales y finales en el sistema electrónico.</li><li>Entregar reportes en los plazos establecidos.</li><li>Cumplir con reglamentos de la unidad receptora.</li><li>Participar en actividades de capacitación si se requiere.</li></ul>`,
            'Contacto con coordinador': `<p><b>Coordinador:</b> Dr. Jose Manuel Tanori Tapia<br>Licenciatura de Cultura Física y Deporte<br><a href="mailto:josemanuel.tanori@unison.mx">josemanuel.tanori@unison.mx</a></p>`
        };

        const practicasProfesionalesRespuestas = {
            'Información general': `<p>Las prácticas profesionales son una experiencia formativa obligatoria que permite a los estudiantes aplicar sus conocimientos en un entorno real y prepararse para el ejercicio profesional.</p>`,
            'Requisitos': `<ul><li>Cumplir con los créditos mínimos requeridos.</li><li>Contar con constancia de seguridad médica vigente.</li><li>Elegir un programa o proyecto convenido o proponer uno nuevo.</li><li>Presentar la solicitud y documentos requeridos.</li></ul>`,
            'Documentos necesarios': `<ul><li>Solicitud de registro del practicante (FPP-2) con constancia médica.</li><li>Reportes parciales y final de actividades (FPP-3 y FPP-4).</li><li>Constancia de seguridad médica.</li><li>Otros documentos requeridos por la unidad receptora o programa.</li></ul>`,
            'Proceso de Inscripción': `<ol><li>Seleccionar un programa o proyecto de prácticas.</li><li>Llenar y entregar la solicitud de registro (FPP-2).</li><li>Registrar la solicitud en la plataforma digital.</li><li>Asignación de tutor y emisión de constancia de inscripción.</li></ol>`,
            'Seguimiento y entrega de reporte': `<ul><li>Realizar actividades bajo supervisión del tutor.</li><li>Entregar reportes parciales y final en físico y PDF.</li><li>El tutor verifica y acredita las prácticas.</li></ul>`,
            'Contacto con coordinador': `<p><b>Coordinadora:</b> M.A.P.E. María Julia León Bazán<br>Licenciatura de Cultura Física y Deporte<br><a href="mailto:julia.leon@unison.mx">julia.leon@unison.mx</a><br>Ext. 4646</p>`
        };

        /**
         * Upsert FAQs (ProcessCategory) for each process and category
         */
        for (const category of categories) {
            await tx.processCategory.upsert({
                where: {
                    processId_categoryId: {
                        processId: servicioSocial.id,
                        categoryId: category.id
                    }
                },
                update: {
                    response: servicioSocialRespuestas[category.name] || ''
                },
                create: {
                    processId: servicioSocial.id,
                    categoryId: category.id,
                    userId: adminUser.id,
                    response: servicioSocialRespuestas[category.name] || ''
                }
            });
            await tx.processCategory.upsert({
                where: {
                    processId_categoryId: {
                        processId: practicas.id,
                        categoryId: category.id
                    }
                },
                update: {
                    response: practicasProfesionalesRespuestas[category.name] || ''
                },
                create: {
                    processId: practicas.id,
                    categoryId: category.id,
                    userId: adminUser.id,
                    response: practicasProfesionalesRespuestas[category.name] || ''
                }
            });
        }
    });
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