import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Política de Privacidad - BiuBan',
  description: 'Política de privacidad y tratamiento de datos personales de BiuBan.',
}

const lastUpdated = '12 de marzo de 2026'

export default function PrivacidadPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5]">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

          <div className="mb-10 border-b border-[#E5E5E5] pb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#586E26]">Legal</p>
            <h1 className="text-2xl font-bold text-[#0B0B0B] sm:text-3xl">Política de Privacidad</h1>
            <p className="mt-3 text-sm text-[#6B6B6B]">Última actualización: {lastUpdated}</p>
          </div>

          <div className="mb-8 rounded-xl border border-[#E5E5E5] bg-white p-5">
            <p className="text-sm leading-relaxed text-[#6B6B6B]">
              En <strong className="text-[#0B0B0B]">BiuBan</strong> nos tomamos muy en serio la
              privacidad de nuestros usuarios. Esta Política describe qué información recopilamos,
              cómo la utilizamos y qué derechos tienes sobre ella, de conformidad con la{' '}
              <strong className="text-[#0B0B0B]">Ley Federal de Protección de Datos Personales
              en Posesión de los Particulares (LFPDPPP)</strong> y demás legislación aplicable
              en México.
            </p>
          </div>

          <div className="space-y-8">

            <Section number="1" title="Responsable del Tratamiento">
              <p>El responsable del tratamiento de sus datos personales es{' '}
              <strong className="text-[#0B0B0B]">BiuBan</strong>, con domicilio en Ciudad de México,
              México. Para cualquier consulta relacionada con el tratamiento de sus datos, puede
              contactarnos en{' '}
                <a href="mailto:hola@biuban.mx"
                  className="text-[#31470B] hover:text-[#586E26]">
                  hola@biuban.mx
                </a>.
              </p>
            </Section>

            <Section number="2" title="Información que Recopilamos">
              <p>BiuBan recopila dos tipos de información:</p>

              <h3 className="mt-4 mb-2 text-sm font-semibold text-[#0B0B0B]">
                a) Información que usted nos proporciona voluntariamente
              </h3>
              <ul className="space-y-2">
                <Li>Dirección de correo electrónico, si se suscribe a alertas de precios
                o boletines.</Li>
                <Li>Mensajes y consultas enviados a través del formulario de contacto.</Li>
              </ul>

              <h3 className="mt-4 mb-2 text-sm font-semibold text-[#0B0B0B]">
                b) Información recopilada automáticamente
              </h3>
              <ul className="space-y-2">
                <Li>Datos de navegación: páginas visitadas, búsquedas realizadas, tiempo en
                el Sitio y acciones dentro de él.</Li>
                <Li>Información técnica: dirección IP, tipo de navegador, sistema operativo,
                dispositivo y resolución de pantalla.</Li>
                <Li>Datos de referencia: el sitio web desde el cual llegó a BiuBan
                (si aplica).</Li>
                <Li>Información de cookies y tecnologías similares (detallado en la
                Sección 6).</Li>
              </ul>

              <p className="mt-3">BiuBan <strong className="text-[#0B0B0B]">no recopila</strong> datos
              de pago, información bancaria ni datos sensibles de ningún tipo. No tenemos acceso a
              ninguna información relacionada con compras realizadas en sitios de terceros.</p>
            </Section>

            <Section number="3" title="Finalidad del Tratamiento">
              <p>Utilizamos la información recopilada para los siguientes fines:</p>
              <ul className="mt-3 space-y-2">
                <Li>Operar y mejorar el funcionamiento del Sitio y sus funcionalidades de búsqueda
                y comparación.</Li>
                <Li>Personalizar la experiencia del usuario mostrando resultados y sugerencias
                relevantes.</Li>
                <Li>Analizar el uso del Sitio de forma agregada y anónima para detectar errores,
                tendencias y áreas de mejora.</Li>
                <Li>Enviar comunicaciones informativas o alertas de precios, únicamente si el
                usuario se suscribió expresamente.</Li>
                <Li>Responder consultas, reportes o solicitudes enviadas por el usuario.</Li>
                <Li>Cumplir con obligaciones legales y requerimientos de autoridades
                competentes.</Li>
              </ul>
            </Section>

            <Section number="4" title="Base Legal del Tratamiento">
              <p>El tratamiento de sus datos personales se basa en:</p>
              <ul className="mt-3 space-y-2">
                <Li><strong className="text-[#0B0B0B]">Consentimiento:</strong> para el envío de
                comunicaciones de marketing o alertas de precios.</Li>
                <Li><strong className="text-[#0B0B0B]">Interés legítimo:</strong> para el análisis
                interno del uso del Sitio y la mejora del servicio.</Li>
                <Li><strong className="text-[#0B0B0B]">Obligación legal:</strong> cuando así lo
                requieran las leyes mexicanas aplicables.</Li>
              </ul>
            </Section>

            <Section number="5" title="Compartición de Datos con Terceros">
              <p>BiuBan <strong className="text-[#0B0B0B]">no vende, arrienda ni comercializa</strong>{' '}
              sus datos personales a terceros con fines publicitarios o de cualquier otra índole.</p>
              <p className="mt-3">Podemos compartir información con:</p>
              <ul className="mt-3 space-y-2">
                <Li><strong className="text-[#0B0B0B]">Proveedores de servicios tecnológicos:</strong>{' '}
                como servicios de alojamiento web, analítica y correo electrónico, que actúan como
                encargados del tratamiento bajo acuerdos de confidencialidad.</Li>
                <Li><strong className="text-[#0B0B0B]">Autoridades competentes:</strong> cuando así
                lo exija una disposición legal, orden judicial o requerimiento gubernamental.</Li>
              </ul>
            </Section>

            <Section number="6" title="Cookies y Tecnologías de Seguimiento">
              <p>BiuBan utiliza cookies y tecnologías similares para mejorar la experiencia del usuario.</p>

              <h3 className="mt-4 mb-2 text-sm font-semibold text-[#0B0B0B]">
                Tipos de cookies que utilizamos:
              </h3>
              <ul className="space-y-2">
                <Li><strong className="text-[#0B0B0B]">Cookies esenciales:</strong> necesarias para
                el funcionamiento básico del Sitio. No pueden desactivarse.</Li>
                <Li><strong className="text-[#0B0B0B]">Cookies de analítica:</strong> nos ayudan a
                entender cómo los usuarios interactúan con el Sitio (por ejemplo, mediante Google
                Analytics o Vercel Analytics). La información se procesa de forma agregada
                y anónima.</Li>
                <Li><strong className="text-[#0B0B0B]">Cookies de preferencias:</strong> recuerdan
                configuraciones y preferencias del usuario entre sesiones.</Li>
              </ul>
              <p className="mt-3">Puede gestionar o eliminar las cookies desde la configuración de su
              navegador. Tenga en cuenta que desactivar ciertas cookies puede afectar el funcionamiento
              del Sitio.</p>
            </Section>

            <Section number="7" title="Retención de Datos">
              <p>Conservamos los datos personales únicamente durante el tiempo necesario para cumplir
              los fines descritos en esta Política:</p>
              <ul className="mt-3 space-y-2">
                <Li>Datos de navegación y analítica: hasta 26 meses.</Li>
                <Li>Correos electrónicos de suscripción: hasta que el usuario solicite la baja.</Li>
                <Li>Comunicaciones de contacto: hasta 12 meses tras la resolución de la consulta.</Li>
              </ul>
              <p className="mt-3">Transcurridos estos plazos, los datos son eliminados o anonimizados
              de forma irreversible.</p>
            </Section>

            <Section number="8" title="Derechos ARCO">
              <p>De conformidad con la LFPDPPP, usted tiene derecho a:</p>
              <ul className="mt-3 space-y-2">
                <Li><strong className="text-[#0B0B0B]">Acceso:</strong> conocer qué datos personales
                tenemos sobre usted y cómo los utilizamos.</Li>
                <Li><strong className="text-[#0B0B0B]">Rectificación:</strong> solicitar la corrección
                de datos inexactos o incompletos.</Li>
                <Li><strong className="text-[#0B0B0B]">Cancelación:</strong> solicitar la eliminación
                de sus datos cuando no sean necesarios para los fines que motivaron su
                recopilación.</Li>
                <Li><strong className="text-[#0B0B0B]">Oposición:</strong> oponerse al tratamiento
                de sus datos para determinadas finalidades.</Li>
              </ul>
              <p className="mt-3">Para ejercer cualquiera de estos derechos, envíe su solicitud a{' '}
                <a href="mailto:hola@biuban.mx"
                  className="text-[#31470B] hover:text-[#586E26]">
                  hola@biuban.mx
                </a>{' '}
                indicando su nombre completo, el derecho que desea ejercer y una descripción de su
                solicitud. Atenderemos su petición en un plazo máximo de{' '}
                <strong className="text-[#0B0B0B]">20 días hábiles</strong>.
              </p>
            </Section>

            <Section number="9" title="Seguridad de los Datos">
              <p>BiuBan implementa medidas técnicas y organizativas razonables para proteger sus datos:</p>
              <ul className="mt-3 space-y-2">
                <Li>Cifrado en tránsito mediante HTTPS/TLS en todas las comunicaciones del Sitio.</Li>
                <Li>Acceso restringido a datos personales únicamente al personal autorizado.</Li>
                <Li>Revisiones periódicas de seguridad y buenas prácticas de desarrollo.</Li>
              </ul>
              <p className="mt-3">Si detecta alguna vulnerabilidad o incidente de seguridad, le pedimos
              notificarlo a{' '}
                <a href="mailto:hola@biuban.mx"
                  className="text-[#31470B] hover:text-[#586E26]">
                  hola@biuban.mx
                </a>.
              </p>
            </Section>

            <Section number="10" title="Transferencias Internacionales">
              <p>Algunos de nuestros proveedores de servicios pueden procesar datos fuera de México.
              En estos casos, nos aseguramos de que dichas transferencias se realicen bajo garantías
              adecuadas de protección, conforme a la legislación mexicana aplicable.</p>
            </Section>

            <Section number="11" title="Menores de Edad">
              <p>BiuBan no está dirigido a menores de 18 años y no recopila intencionalmente datos
              personales de menores. Si usted es padre, madre o tutor y tiene conocimiento de que
              un menor nos ha proporcionado datos personales, le pedimos que nos contacte para
              proceder a su eliminación.</p>
            </Section>

            <Section number="12" title="Cambios a esta Política">
              <p>Podemos actualizar esta Política periódicamente. Cuando lo hagamos, actualizaremos
              la fecha de "Última actualización" en la parte superior de esta página. El uso
              continuado del Sitio después de publicados los cambios implica la aceptación de
              la nueva versión.</p>
            </Section>

            <Section number="13" title="Contacto y Autoridad Competente">
              <p>Para cualquier consulta, solicitud o queja relacionada con sus datos personales:</p>
              <p className="mt-3">
                <strong className="text-[#0B0B0B]">Correo electrónico:</strong>{' '}
                <a href="mailto:hola@biuban.mx"
                  className="text-[#31470B] hover:text-[#586E26]">
                  hola@biuban.mx
                </a>
              </p>
              <p className="mt-3">Si considera que su solicitud no fue atendida satisfactoriamente,
              tiene derecho a acudir ante el Instituto Nacional de Transparencia, Acceso a la
              Información y Protección de Datos Personales{' '}
              (<strong className="text-[#0B0B0B]">INAI</strong>), autoridad reguladora en materia
              de protección de datos en México.</p>
              <p className="mt-2">
                <a href="https://www.inai.org.mx" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-[#31470B] hover:text-[#586E26]">
                  www.inai.org.mx →
                </a>
              </p>
            </Section>

          </div>

          <div className="mt-12 flex items-center justify-between border-t border-[#E5E5E5] pt-6 text-sm">
            <Link href="/terminos" className="text-[#31470B] transition-colors hover:text-[#586E26]">
              ← Términos de Uso
            </Link>
            <Link href="/" className="text-[#6B6B6B] transition-colors hover:text-[#31470B]">
              Volver al inicio →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}

function Section({ number, title, children }: {
  number: string; title: string; children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="mb-3 flex items-baseline gap-2 text-base font-bold text-[#0B0B0B]">
        <span className="text-xs font-semibold text-[#586E26]">{number}.</span>
        {title}
      </h2>
      <div className="text-sm leading-relaxed text-[#6B6B6B]">{children}</div>
    </div>
  )
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#586E26]" />
      <span>{children}</span>
    </li>
  )
}