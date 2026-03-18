import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Política de Privacidad - BiuBan',
  description:
    'Política de privacidad completa de BiuBan: datos personales, cookies, afiliados CJ Affiliate, GDPR, CCPA y derechos ARCO.',
}

const lastUpdated = '18 de marzo de 2026'

export default function PrivacidadPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5]">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

          {/* Encabezado */}
          <div className="mb-10 border-b border-[#E5E5E5] pb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#586E26]">
              Documento Legal · Publisher CJ Affiliates
            </p>
            <h1 className="text-2xl font-bold text-[#0B0B0B] sm:text-3xl">
              Política de Privacidad
            </h1>
            <p className="mt-3 text-sm text-[#6B6B6B]">
              Última actualización: {lastUpdated}
            </p>
          </div>

          {/* Intro */}
          <div className="mb-8 rounded-xl border border-[#E5E5E5] bg-white p-5">
            <p className="text-sm leading-relaxed text-[#6B6B6B]">
              En <strong className="text-[#0B0B0B]">BiuBan</strong> nos tomamos muy en serio la
              privacidad de nuestros usuarios. Esta Política describe qué información recopilamos,
              cómo la utilizamos y qué derechos tienes sobre ella, de conformidad con la{' '}
              <strong className="text-[#0B0B0B]">
                Ley Federal de Protección de Datos Personales en Posesión de los Particulares
                (LFPDPPP)
              </strong>
              , el <strong className="text-[#0B0B0B]">GDPR</strong> (Reglamento europeo),
              la <strong className="text-[#0B0B0B]">CCPA</strong> (California) y los requisitos del{' '}
              <strong className="text-[#0B0B0B]">Publisher Service Agreement de CJ Affiliate</strong>.
              Este sitio participa en programas de afiliados a través de{' '}
              <strong className="text-[#0B0B0B]">CJ Affiliate (Commission Junction)</strong>.
            </p>
          </div>

          {/* Índice */}
          <div className="mb-10 rounded-xl border border-[#E5E5E5] bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">
              Contenido
            </p>
            <ol className="space-y-1.5 text-sm text-[#6B6B6B]">
              {[
                'Información que recopilamos',
                'Cookies y tecnología de rastreo',
                'CJ Affiliate — Divulgación de relación de afiliado',
                'Cómo usamos tu información',
                'Bases legales para el procesamiento (GDPR)',
                'Compartir información con terceros',
                'Tus derechos como usuario',
                'Usuarios de California — CCPA',
                'Seguridad de los datos',
                'Retención de datos',
                'Menores de edad',
                'Cambios a esta política',
                'Contacto',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="shrink-0 text-xs font-bold text-[#586E26]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-8">

            {/* 01 */}
            <Section number="01" title="Información que recopilamos">
              <SubHeading>Información que nos proporcionas</SubHeading>
              <ul className="space-y-2">
                <Li>Nombre y dirección de correo electrónico (si te suscribes a nuestra newsletter o envías un formulario de contacto).</Li>
                <Li>Comentarios, mensajes o consultas que nos envíes directamente.</Li>
                <Li>Cualquier otra información que decidas compartir voluntariamente.</Li>
              </ul>

              <SubHeading>Información recopilada automáticamente</SubHeading>
              <ul className="space-y-2">
                <Li>Dirección IP y ubicación geográfica aproximada.</Li>
                <Li>Tipo de navegador, sistema operativo y dispositivo.</Li>
                <Li>Páginas visitadas, tiempo de permanencia y fuente de tráfico.</Li>
                <Li>Identificadores de cookies y píxeles de seguimiento.</Li>
                <Li>Datos de clics en enlaces de afiliados.</Li>
              </ul>

              <p className="mt-3">
                Recopilamos esta información a través de cookies, balizas web (web beacons), píxeles
                de seguimiento y tecnologías similares, incluida la tecnología de rastreo de CJ
                Affiliate.
              </p>
              <p className="mt-3">
                BiuBan <strong className="text-[#0B0B0B]">no recopila</strong> datos de pago,
                información bancaria ni datos sensibles. No tenemos acceso a ninguna información
                relacionada con compras realizadas en sitios de terceros.
              </p>
            </Section>

            {/* 02 */}
            <Section number="02" title="Cookies y tecnología de rastreo">
              <p>
                Utilizamos cookies y tecnologías similares para operar y mejorar este sitio, analizar
                el tráfico y rastrear transacciones de afiliados. A continuación detallamos los tipos
                de cookies que usamos:
              </p>

              {/* Tabla de cookies */}
              <div className="mt-4 overflow-x-auto rounded-lg border border-[#E5E5E5]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E5E5] bg-[#F5F5F5]">
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]">
                        Tipo de cookie
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]">
                        Propósito
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]">
                        Duración
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5] text-[#6B6B6B]">
                    <tr>
                      <td className="px-4 py-3 font-medium text-[#0B0B0B]">Esenciales</td>
                      <td className="px-4 py-3">Necesarias para el funcionamiento básico del sitio</td>
                      <td className="px-4 py-3">Sesión</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-[#0B0B0B]">Analíticas</td>
                      <td className="px-4 py-3">Analizar el comportamiento de usuarios (ej. Vercel Analytics)</td>
                      <td className="px-4 py-3">Hasta 24 meses</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-[#0B0B0B]">De afiliados (CJ)</td>
                      <td className="px-4 py-3">Rastrear clics y transacciones de afiliados referidos por este sitio</td>
                      <td className="px-4 py-3">Hasta 13 meses</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-[#0B0B0B]">De publicidad</td>
                      <td className="px-4 py-3">Mostrar anuncios relevantes a los usuarios</td>
                      <td className="px-4 py-3">Variable</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <SubHeading>Control de cookies</SubHeading>
              <p>
                Puedes controlar o eliminar las cookies desde la configuración de tu navegador. Ten en
                cuenta que desactivar ciertas cookies puede afectar la funcionalidad del sitio. Visita{' '}
                <ExternalLink href="https://www.allaboutcookies.org">allaboutcookies.org</ExternalLink>{' '}
                para más información.
              </p>

              <SubHeading>Rastreo sin cookies (cookieless tracking)</SubHeading>
              <p>
                CJ Affiliate puede utilizar tecnología de rastreo sin cookies que preserva el
                seguimiento de transacciones incluso cuando las cookies de terceros están bloqueadas
                por el navegador, en cumplimiento con las leyes de privacidad aplicables.
              </p>
            </Section>

            {/* 03 */}
            <Section number="03" title="CJ Affiliate — Divulgación de relación de afiliado">
              {/* Caja destacada FTC */}
              <div className="rounded-lg border-l-4 border-[#586E26] bg-[#F9FBF4] p-4">
                <p className="text-sm leading-relaxed text-[#0B0B0B]">
                  <strong>Divulgación de afiliado (requerida por la FTC):</strong>{' '}
                  Este sitio web participa en el programa de afiliados de{' '}
                  <strong>CJ Affiliate (Commission Junction)</strong>, operado por Publicis Groupe.
                  Esto significa que podemos ganar una comisión si haces clic en ciertos enlaces de
                  este sitio y realizas una compra, <em>sin costo adicional para ti</em>. Nuestras
                  opiniones y recomendaciones son independientes y no están influenciadas por estas
                  relaciones comerciales.
                </p>
              </div>

              <SubHeading>Cómo funciona el rastreo de CJ Affiliate</SubHeading>
              <p>
                Cuando haces clic en un enlace de afiliado en nuestro sitio, CJ Affiliate coloca una
                cookie o utiliza un identificador de evento (Event ID) en tu navegador para rastrear
                si realizas una compra en el sitio del anunciante. Esta información se usa
                exclusivamente para acreditarnos la comisión correspondiente.
              </p>

              <SubHeading>Datos que CJ Affiliate puede recopilar</SubHeading>
              <ul className="space-y-2">
                <Li>Identificadores de cookies y de dispositivo (datos pseudonimizados).</Li>
                <Li>Información de clics y transacciones (sin identificar personalmente al usuario).</Li>
                <Li>Datos de comportamiento para análisis de rendimiento del programa de afiliados.</Li>
              </ul>
              <p className="mt-3">
                Nos comprometemos a{' '}
                <strong className="text-[#0B0B0B]">
                  no transmitir información de identificación personal de los visitantes
                </strong>{' '}
                a CJ Affiliate que les permita identificar directamente a un individuo, tal como lo
                exige el Acuerdo de Publicador de CJ.
              </p>

              <SubHeading>Política de privacidad de CJ Affiliate</SubHeading>
              <p>
                Puedes consultar la política de privacidad de CJ Affiliate directamente en:{' '}
                <ExternalLink href="https://www.cj.com/legal/privacy">
                  cj.com/legal/privacy
                </ExternalLink>
              </p>
              <p className="mt-2">
                Para ejercer tus derechos sobre los datos recopilados por CJ Affiliate (incluyendo
                opt-out), visita:{' '}
                <ExternalLink href="https://www.cj.com/optout">cj.com/optout</ExternalLink>
              </p>

              <SubHeading>Consentimiento de cookies de CJ Affiliate</SubHeading>
              <p>
                Si eres usuario de la Unión Europea, CJ Affiliate requiere tu consentimiento antes
                de depositar o leer cookies en tu dispositivo. El consentimiento es válido por 13
                meses, salvo que cambies tus preferencias.
              </p>
            </Section>

            {/* 04 */}
            <Section number="04" title="Cómo usamos tu información">
              <ul className="space-y-2">
                <Li>Operar, mantener y mejorar este sitio web y sus funcionalidades de búsqueda y comparación.</Li>
                <Li>Rastrear y atribuir transacciones de afiliados correctamente.</Li>
                <Li>Enviarte newsletters o comunicaciones si te has suscrito (con tu consentimiento previo).</Li>
                <Li>Analizar el tráfico y el comportamiento de usuarios para mejorar el contenido.</Li>
                <Li>Detectar y prevenir fraudes o actividades maliciosas.</Li>
                <Li>Cumplir con obligaciones legales y regulatorias.</Li>
                <Li>Responder a tus consultas y solicitudes de soporte.</Li>
              </ul>
              <p className="mt-3 font-medium text-[#0B0B0B]">
                No vendemos tu información personal a terceros.
              </p>
            </Section>

            {/* 05 */}
            <Section number="05" title="Bases legales para el procesamiento (GDPR)">
              <p>
                Si te encuentras en el Espacio Económico Europeo (EEE), procesamos tu información
                bajo las siguientes bases legales conforme al Reglamento General de Protección de
                Datos (GDPR):
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    title: 'Consentimiento',
                    desc: 'Para cookies no esenciales, newsletters y publicidad.',
                  },
                  {
                    title: 'Interés legítimo',
                    desc: 'Para análisis, seguridad y mejora del servicio.',
                  },
                  {
                    title: 'Obligación legal',
                    desc: 'Cuando la ley nos exige procesar ciertos datos.',
                  },
                  {
                    title: 'Ejecución de contrato',
                    desc: 'Para gestionar suscripciones o servicios contratados.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border border-[#E5E5E5] bg-white p-4"
                  >
                    <p className="font-semibold text-[#0B0B0B]">{item.title}</p>
                    <p className="mt-1 text-xs text-[#6B6B6B]">{item.desc}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4">
                Para el rastreo de afiliados, CJ Affiliate considera que el{' '}
                <strong className="text-[#0B0B0B]">interés legítimo</strong> es una base legal
                aceptable para procesar y retener datos recopilados a través de cookies, aunque se
                requiere consentimiento previo para la colocación inicial de cookies en usuarios de
                la UE conforme a la Directiva ePrivacy.
              </p>

              <SubHeading>Derechos ARCO (México — LFPDPPP)</SubHeading>
              <p>
                De conformidad con la LFPDPPP, los usuarios en México tienen derecho a:
              </p>
              <ul className="mt-3 space-y-2">
                <Li><strong className="text-[#0B0B0B]">Acceso:</strong> conocer qué datos personales tenemos sobre ti y cómo los utilizamos.</Li>
                <Li><strong className="text-[#0B0B0B]">Rectificación:</strong> solicitar la corrección de datos inexactos o incompletos.</Li>
                <Li><strong className="text-[#0B0B0B]">Cancelación:</strong> solicitar la eliminación de tus datos cuando no sean necesarios para los fines que motivaron su recopilación.</Li>
                <Li><strong className="text-[#0B0B0B]">Oposición:</strong> oponerte al tratamiento de tus datos para determinadas finalidades.</Li>
              </ul>
              <p className="mt-3">
                Para ejercer tus derechos ARCO, envía tu solicitud a{' '}
                <EmailLink>privacidad@biuban.com</EmailLink> indicando tu nombre, el derecho que
                deseas ejercer y una descripción de tu solicitud. Atenderemos tu petición en un
                plazo máximo de <strong className="text-[#0B0B0B]">20 días hábiles</strong>.
              </p>
              <p className="mt-2">
                Si tu solicitud no fue atendida satisfactoriamente, puedes acudir ante el{' '}
                <strong className="text-[#0B0B0B]">INAI</strong>:{' '}
                <ExternalLink href="https://www.inai.org.mx">www.inai.org.mx</ExternalLink>
              </p>
            </Section>

            {/* 06 */}
            <Section number="06" title="Compartir información con terceros">
              <p>
                Compartimos información con terceros de confianza únicamente en los siguientes casos:
              </p>

              <SubHeading>Proveedores de servicios</SubHeading>
              <ul className="space-y-2">
                <Li>
                  <strong className="text-[#0B0B0B]">CJ Affiliate / Commission Junction</strong> —
                  Rastreo de transacciones de afiliados y atribución de comisiones.
                </Li>
                <Li>
                  <strong className="text-[#0B0B0B]">Vercel Analytics</strong> — Análisis de
                  tráfico web (datos anonimizados). Alojamiento y entrega del sitio web.
                </Li>
                <Li>
                  <strong className="text-[#0B0B0B]">Supabase</strong> — Base de datos y
                  almacenamiento seguro (servidores en la nube).
                </Li>
                <Li>
                  <strong className="text-[#0B0B0B]">OpenAI</strong> — Análisis de imágenes para la
                  funcionalidad de búsqueda por imagen (solo cuando el usuario activa esta función).
                </Li>
                <Li>
                  <strong className="text-[#0B0B0B]">Mercado Libre Afiliados</strong> — Programa de
                  afiliados para productos y ofertas de Mercado Libre México.
                </Li>
              </ul>

              <SubHeading>Otros casos</SubHeading>
              <ul className="space-y-2">
                <Li>Cuando la ley lo exija (órdenes judiciales, requerimientos regulatorios).</Li>
                <Li>Para proteger nuestros derechos legales o los de terceros.</Li>
                <Li>En caso de fusión, adquisición o venta de activos (con notificación previa).</Li>
              </ul>
              <p className="mt-3">
                Todos nuestros proveedores de terceros están obligados contractualmente a proteger tu
                información y a no utilizarla para fines distintos de los acordados.
              </p>
            </Section>

            {/* 07 */}
            <Section number="07" title="Tus derechos como usuario">
              <p>
                Dependiendo de tu ubicación, puedes tener los siguientes derechos sobre tus datos
                personales:
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { title: 'Acceso', desc: 'Solicitar una copia de tus datos personales.' },
                  { title: 'Rectificación', desc: 'Corregir datos inexactos o incompletos.' },
                  { title: 'Supresión', desc: 'Solicitar la eliminación de tus datos ("derecho al olvido").' },
                  { title: 'Oposición', desc: 'Oponerte al procesamiento basado en interés legítimo.' },
                  { title: 'Limitación', desc: 'Restringir el procesamiento de tus datos en ciertos casos.' },
                  { title: 'Portabilidad', desc: 'Recibir tus datos en formato estructurado y legible.' },
                  { title: 'Revocar consentimiento', desc: 'Retirar tu consentimiento en cualquier momento.' },
                  { title: 'Reclamación', desc: 'Presentar queja ante la autoridad de protección de datos.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-[#E5E5E5] bg-white p-4">
                    <p className="font-semibold text-[#0B0B0B]">{item.title}</p>
                    <p className="mt-1 text-xs text-[#6B6B6B]">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4">
                Para ejercer cualquiera de estos derechos, contáctanos en{' '}
                <EmailLink>privacidad@biuban.com</EmailLink>. Responderemos en un plazo máximo de{' '}
                <strong className="text-[#0B0B0B]">30 días</strong>.
              </p>

              <SubHeading>Opt-out de rastreo de CJ Affiliate</SubHeading>
              <p>
                Puedes optar por no ser rastreado por CJ Affiliate visitando{' '}
                <ExternalLink href="https://www.cj.com/optout">cj.com/optout</ExternalLink>.
              </p>
            </Section>

            {/* 08 */}
            <Section number="08" title="Usuarios de California — CCPA">
              <p>
                Si eres residente de California, la{' '}
                <strong className="text-[#0B0B0B]">
                  Ley de Privacidad del Consumidor de California (CCPA)
                </strong>{' '}
                te otorga derechos adicionales:
              </p>
              <ul className="mt-3 space-y-2">
                <Li>
                  <strong className="text-[#0B0B0B]">Derecho a saber:</strong> Puedes solicitar
                  información sobre las categorías y piezas específicas de datos personales que hemos
                  recopilado sobre ti.
                </Li>
                <Li>
                  <strong className="text-[#0B0B0B]">Derecho a eliminar:</strong> Puedes solicitar
                  la eliminación de tu información personal.
                </Li>
                <Li>
                  <strong className="text-[#0B0B0B]">Derecho a no discriminación:</strong> No te
                  discriminaremos por ejercer tus derechos bajo la CCPA.
                </Li>
                <Li>
                  <strong className="text-[#0B0B0B]">Derecho a opt-out:</strong> Tienes derecho a
                  optar por no participar en la &quot;venta&quot; de tu información personal.{' '}
                  <em>Nota: No vendemos información personal.</em>
                </Li>
              </ul>
              <p className="mt-3">
                Para ejercer tus derechos bajo la CCPA, contáctanos en{' '}
                <EmailLink>privacidad@biuban.com</EmailLink>. Verificaremos tu identidad antes de
                procesar la solicitud.
              </p>
            </Section>

            {/* 09 */}
            <Section number="09" title="Seguridad de los datos">
              <p>
                Implementamos medidas técnicas y organizativas razonables para proteger tu
                información personal contra acceso no autorizado, pérdida, destrucción o divulgación
                accidental. Estas medidas incluyen:
              </p>
              <ul className="mt-3 space-y-2">
                <Li>Transmisión de datos mediante conexiones HTTPS cifradas (TLS).</Li>
                <Li>Acceso restringido a datos personales solo al personal autorizado.</Li>
                <Li>Revisión periódica de nuestras prácticas de seguridad.</Li>
                <Li>Base de datos alojada en Supabase con controles de acceso por fila (RLS).</Li>
              </ul>
              <p className="mt-3">
                Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico
                es 100% seguro. Si sospechas de un acceso no autorizado a tu información, contáctanos
                de inmediato en <EmailLink>privacidad@biuban.com</EmailLink>.
              </p>
            </Section>

            {/* 10 */}
            <Section number="10" title="Retención de datos">
              <p>
                Conservamos tu información personal únicamente durante el tiempo necesario para
                cumplir los fines descritos en esta política o según lo exija la ley:
              </p>
              <ul className="mt-3 space-y-2">
                <Li>Datos de contacto y suscripción: mientras mantengas tu cuenta o suscripción activa.</Li>
                <Li>Cookies de CJ Affiliate: hasta 13 meses desde el último consentimiento.</Li>
                <Li>Datos analíticos: hasta 26 meses (según configuración de Vercel Analytics).</Li>
                <Li>Registros de transacciones de afiliados: según lo requieran las obligaciones contables y fiscales.</Li>
                <Li>Comunicaciones de contacto: hasta 12 meses tras la resolución de la consulta.</Li>
              </ul>
              <p className="mt-3">
                Transcurridos estos plazos, los datos son eliminados o anonimizados de forma
                irreversible.
              </p>
            </Section>

            {/* 11 */}
            <Section number="11" title="Menores de edad">
              <p>
                Este sitio web no está dirigido a personas menores de 13 años (o de 16 años en el
                EEE). No recopilamos intencionalmente información personal de menores. Si eres
                padre, madre o tutor y crees que tu hijo nos ha proporcionado información personal,
                contáctanos en <EmailLink>privacidad@biuban.com</EmailLink> para que podamos
                eliminarla.
              </p>
            </Section>

            {/* 12 */}
            <Section number="12" title="Cambios a esta política">
              <p>
                Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios
                en nuestras prácticas o en la legislación aplicable. Cuando lo hagamos,
                actualizaremos la fecha de &quot;Última actualización&quot; en la parte superior de
                este documento.
              </p>
              <p className="mt-3">
                Te recomendamos revisar esta política regularmente. El uso continuado de este sitio
                después de cualquier cambio constituye tu aceptación de la política actualizada.
              </p>
            </Section>

            {/* 13 */}
            <Section number="13" title="Contacto">
              <p>
                Si tienes preguntas, comentarios o solicitudes relacionadas con esta Política de
                Privacidad o el tratamiento de tus datos personales, puedes contactarnos a través de:
              </p>

              <div className="mt-4 rounded-lg border border-[#E5E5E5] bg-white p-5 text-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#586E26]">
                  Responsable del sitio
                </p>
                <p className="font-semibold text-[#0B0B0B]">BiuBan</p>
                <p className="mt-1 text-[#6B6B6B]">
                  📧 Email de privacidad:{' '}
                  <EmailLink>privacidad@biuban.com</EmailLink>
                </p>
                <p className="mt-1 text-[#6B6B6B]">
                  📧 Contacto general:{' '}
                  <EmailLink>hola@biuban.com</EmailLink>
                </p>
                <p className="mt-1 text-[#6B6B6B]">
                  🌐 Sitio web:{' '}
                  <ExternalLink href="https://biuban.com">biuban.com</ExternalLink>
                </p>
                <p className="mt-1 text-[#6B6B6B]">
                  📍 Dirección: Ciudad de México, México (solo operaciones en línea)
                </p>
              </div>

              <p className="mt-4">
                Si no recibes respuesta en 30 días, tienes derecho a presentar una reclamación ante
                la autoridad de protección de datos de tu país. En México:{' '}
                <strong className="text-[#0B0B0B]">INAI</strong> —{' '}
                <ExternalLink href="https://www.inai.org.mx">www.inai.org.mx</ExternalLink>
              </p>
            </Section>

          </div>

          {/* Pie legal */}
          <div className="mt-10 rounded-lg border border-[#E5E5E5] bg-[#F9FBF4] px-5 py-4 text-center text-xs text-[#6B6B6B]">
            © 2026 BiuBan · Esta política cumple con los requisitos del{' '}
            <strong className="text-[#0B0B0B]">Publisher Service Agreement de CJ Affiliate</strong>
            , la <strong className="text-[#0B0B0B]">FTC</strong>, el{' '}
            <strong className="text-[#0B0B0B]">GDPR</strong>, la{' '}
            <strong className="text-[#0B0B0B]">CCPA</strong> y la{' '}
            <strong className="text-[#0B0B0B]">LFPDPPP</strong> (México).
          </div>

          {/* Navegación pie */}
          <div className="mt-8 flex items-center justify-between border-t border-[#E5E5E5] pt-6 text-sm">
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

/* ─── Componentes auxiliares ─── */

function Section({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="mb-3 flex items-baseline gap-2 text-base font-bold text-[#0B0B0B]">
        <span className="text-xs font-bold text-[#586E26]">{number}</span>
        {title}
      </h2>
      <div className="border-t border-[#E5E5E5] pt-4 text-sm leading-relaxed text-[#6B6B6B]">
        {children}
      </div>
    </div>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-[#0B0B0B]">
      {children}
    </h3>
  )
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-[5px] shrink-0 text-[#586E26]">→</span>
      <span>{children}</span>
    </li>
  )
}

function EmailLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={`mailto:${children}`}
      className="text-[#31470B] underline-offset-2 hover:text-[#586E26] hover:underline"
    >
      {children}
    </a>
  )
}

function ExternalLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#31470B] underline-offset-2 hover:text-[#586E26] hover:underline"
    >
      {children}
    </a>
  )
}
