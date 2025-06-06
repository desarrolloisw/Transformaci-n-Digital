import { hashPassword } from '../src/config/bcrypt.config.js';
import { deterministicEncrypt } from '../src/config/crypto.config.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    await prisma.$transaction(async (tx) => {
        // Upsert tipos de usuario
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

        // Upsert usuario admin
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

        // Upsert procesos
        const [servicioSocial, practicas] = await Promise.all([
            tx.process.upsert({
                where: { name: 'Servicio Social' },
                update: {},
                create: {
                    name: 'Servicio Social',
                    description: 'El Servicio Social es una actividad temporal y obligatoria...',
                    userId: adminUser.id,
                }
            }),
            tx.process.upsert({
                where: { name: 'Prácticas Profesionales' },
                update: {},
                create: {
                    name: 'Prácticas Profesionales',
                    description: 'Las prácticas profesionales son actividades curriculares...',
                    userId: adminUser.id,
                }
            })
        ]);

        // Upsert categorías
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

        // Upsert tipos de acción
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

        // Respuestas para Servicio Social y Prácticas Profesionales
        const servicioSocialRespuestas = {
            'Información general': `<p><b>Descripción:</b><br>El Servicio Social Universitario (SSU) es un espacio educativo de vinculación insertado en los planes de estudio, de carácter obligatorio y temporal, que realizan los estudiantes de la Universidad de Sonora como parte de su formación profesional en beneficio de la comunidad y en estrecha relación con la problemática que plantea el desarrollo social. Este servicio forma parte de las funciones de extensión universitaria, permitiendo al estudiante vincular su formación teórico-práctica a una problemática social concreta, con el fin de coadyuvar en su atención y solución.</p>`,
            'Requisitos': `<b>Requisitos para iniciar el Servicio Social Universitario:</b><ol><li>Cubrir el 70% de los créditos previstos en el plan de estudios correspondiente.</li><li>Asistir a la plática de inducción organizada en su programa académico o división respectiva, como requisito para su inscripción al servicio social.</li><li>Elegir un programa permanente o proyecto de servicio social previamente aprobado por el Comité Institucional de Servicio Social Universitario (CISSU) y solicitar su registro con el responsable del programa o proyecto.</li><li>Iniciar el servicio social a partir de la fecha establecida en el programa o proyecto, además de realizar los trámites correspondientes ante el Coordinador Divisional o Responsable de Servicio Social del programa educativo.</li></ol>`,
            'Documentos necesarios': `<b>Documentos necesarios para liberar el Servicio Social Universitario:</b><ol><li>Reporte final firmado por el estudiante y el Tutor de Servicio Social y sellado por la unidad receptora.</li><li>Constancia de prestación de servicio social que certifique el cumplimiento del servicio social expedida por la Unidad Receptora, la cual deberá ser firmada y sellada por el responsable del programa o proyecto o programa en la unidad receptora.</li><li>Constancia impresa de la página de servicio social de liberación para su autorización y firma.</li><li>Comprobante de pago por la emisión de la constancia de liberación del SSU y, en su caso, de las sanciones económicas generadas.</li></ol>`,
            'Proceso de Inscripción': `<b>Proceso de inscripción al Servicio Social Universitario:</b><ol><li>Cumplir con el 70% de los créditos del plan de estudios para poder inscribirse.</li><li>Asistir a la plática de inducción organizada por el programa académico o división correspondiente.</li><li>Elegir un programa o proyecto de servicio social previamente aprobado por el CISSU.</li><li>Solicitar el registro del programa o proyecto con el responsable de este.</li><li>Realizar los trámites correspondientes ante el Coordinador Divisional o Responsable de Servicio Social del programa educativo.</li><li>Iniciar el servicio social a partir de la fecha establecida en el programa o proyecto.</li></ol>`,
            'Seguimiento y entrega de reporte': `<b>Seguimiento y entrega de reporte durante el Servicio Social Universitario:</b><ol><li>Capturar en el sistema electrónico de servicio social el reporte parcial de actividades: El reporte parcial debe ser capturado dentro de los primeros diez días hábiles tras haber concluido el trimestre respectivo.</li><li>Capturar en el sistema y entregar un reporte final de actividades: El reporte final debe ser entregado y tramitado para la liberación del Servicio Social Universitario en un plazo no mayor de 30 días hábiles una vez concluido el mismo.</li><li>Cumplir con las disposiciones y reglamentos de las Unidades Receptoras donde presta su servicio social.</li><li>Participar en actividades de capacitación previas a la prestación del servicio social, cuando el programa o proyecto de adscripción así lo requiera.</li></ol>`,
            'Contacto con coordinador': `<b>Contacto con coordinador:</b><br>Dr. Jose Manuel Tanori Tapia<br>Coordinador de servicio social del programa educativo<br>Licenciatura de Cultura Física y Deporte<br><a href="mailto:josemanuel.tanori@unison.mx">josemanuel.tanori@unison.mx</a>`
        };

        const practicasProfesionalesRespuestas = {
            'Información general': `<p><b>Descripción:</b><br>Las prácticas profesionales son un componente curricular obligatorio en los planes de estudio de las licenciaturas de la Universidad de Sonora. Se definen como el conjunto de actividades y quehaceres propios de la formación profesional del estudiante, diseñadas para integrar los conocimientos teóricos adquiridos durante su formación académica con la realidad profesional.<br><br><b>Objetivos principales:</b><ol><li><b>Aplicar el conocimiento teórico:</b> Los estudiantes pueden aplicar los conceptos y habilidades aprendidos en el aula a situaciones reales.</li><li><b>Desarrollar competencias profesionales:</b> Fortalecer habilidades técnicas, sociales y de resolución de problemas.</li><li><b>Vinculación universidad-sociedad:</b> Establecer vínculos entre la institución educativa y entidades receptoras (sectores público, social y privado).</li><li><b>Preparación para la inserción laboral:</b> Proporcionar experiencia práctica que facilite la transición al mercado laboral.</li></ol></p>`,
            'Requisitos': `<b>Requisitos para realizar las prácticas profesionales:</b><ol><li>Cumplir con los créditos mínimos requeridos: El estudiante debe haber cursado el número de créditos establecido por su programa educativo antes de inscribirse en las prácticas profesionales.</li><li>Presentar constancia de seguridad médica: El estudiante debe contar con una constancia vigente de servicios médicos (IMSS, ISSSTE, ISSSTESON, Seguro Popular, etc.) o solicitarla en la Dirección de Servicios Estudiantiles si no la tiene.</li><li>Elegir un programa o proyecto de prácticas profesionales: Debe seleccionar un programa o proyecto convenido entre la Universidad de Sonora y las Unidades Receptoras, o proponer uno nuevo ante el Coordinador o Responsable de Prácticas Profesionales de su programa educativo.</li><li>Cumplir con los trámites administrativos: Presentar la solicitud de registro del practicante (Formato FPP-2) y otros documentos necesarios según el procedimiento establecido.</li></ol>`,
            'Documentos necesarios': `<b>Documentos necesarios para prácticas profesionales:</b><ol><li><b>Solicitud de Registro del Practicante (FPP-2):</b><ul><li>Contiene datos personales del estudiante, información sobre la unidad receptora, firma y sellos correspondientes.</li><li>Debe incluir constancia de seguridad médica.</li></ul></li><li><b>Reporte Parcial de Actividades (FPP-3):</b><ul><li>Presentado durante la realización de las prácticas, describe las actividades realizadas, supervisado y aprobado por el tutor y el responsable de la Unidad Receptora.</li><li>Debe entregarse físicamente y en formato PDF (no más de 2 MB).</li></ul></li><li><b>Reporte Final de Actividades (FPP-4):</b><ul><li>Presentado al finalizar las prácticas, contiene una descripción detallada de las actividades realizadas, retroalimentación y firmas correspondientes.</li><li>Debe entregarse físicamente y en formato PDF (no más de 2 MB).</li></ul></li><li><b>Constancia de Seguridad Médica:</b><ul><li>Certificado emitido por IMSS, ISSSTE, ISSSTESON, Seguro Popular u otra entidad equivalente.</li></ul></li><li><b>Otros documentos adicionales:</b><ul><li>Cualquier otro documento requerido por la Unidad Receptora o el programa educativo específico.</li></ul></li></ol>`,
            'Proceso de Inscripción': `<b>Proceso de inscripción a las prácticas profesionales:</b><ol><li><b>Selección del programa o proyecto:</b> El estudiante debe elegir un programa o proyecto de prácticas profesionales convenido entre la Universidad y las Unidades Receptoras, o proponer uno nuevo.</li><li><b>Llenado de la Solicitud de Registro del Practicante (FPP-2):</b> El estudiante debe llenar el formato FPP-2, incluyendo sus datos personales, información de la unidad receptora y constancia de seguridad médica.</li><li><b>Entrega de la solicitud:</b> La solicitud debe ser entregada al Tutor de Prácticas Profesionales, o en su caso, al Coordinador o Responsable de Prácticas Profesionales del programa educativo.</li><li><b>Registro en la plataforma digital:</b> Una vez recibida la solicitud, el Coordinador o Responsable de Prácticas Profesionales realiza el registro en la plataforma digital de prácticas profesionales.</li><li><b>Asignación del tutor:</b> El jefe de Departamento emite el nombramiento del Tutor de Prácticas Profesionales, quien será el encargado de asesorar y evaluar al estudiante durante las prácticas.</li><li><b>Inscripción oficial:</b> El estudiante recibe la Constancia de Inscripción, emitida automáticamente por la plataforma digital.</li></ol>`,
            'Seguimiento y entrega de reporte': `<b>Seguimiento y entrega de reporte durante las prácticas profesionales:</b><ol><li><b>Realización de actividades:</b> El estudiante debe desempeñar las actividades acordadas con la Unidad Receptora y bajo la supervisión del Tutor de Prácticas Profesionales.</li><li><b>Presentación de Reportes Parciales (FPP-3):</b> El estudiante debe elaborar y entregar reportes parciales de las actividades realizadas, supervisados y aprobados por el Tutor y el responsable de la Unidad Receptora. Estos reportes deben entregarse físicamente y en formato PDF (no más de 2 MB).</li><li><b>Presentación del Reporte Final (FPP-4):</b> Al finalizar las prácticas, el estudiante debe presentar el Reporte Final de Actividades, que describe todas las actividades realizadas y recibe retroalimentación. Este reporte también debe entregarse físicamente y en formato PDF (no más de 2 MB).</li><li><b>Acreditación de las prácticas:</b> El Tutor verifica la integración del expediente de prácticas profesionales, incluyendo todos los reportes parciales y el final. Una vez evaluados los reportes, el estudiante recibe la Constancia de Liberación de Prácticas Profesionales.</li></ol>`,
            'Contacto con coordinador': `<b>Contacto con coordinador:</b><br>M.A.P.E. María Julia León Bazán<br>Coordinadora de prácticas profesionales del programa educativo<br>Licenciatura de Cultura Física y Deporte<br><a href="mailto:julia.leon@unison.mx">julia.leon@unison.mx</a><br>Ext. 4646`
        };

        // Upsert FAQs (ProcessCategory)
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