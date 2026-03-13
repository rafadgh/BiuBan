import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Términos de Uso - BiuBan',
  description: 'Términos y condiciones de uso de BiuBan, el comparador de precios de moda en México.',
}

const lastUpdated = '12 de marzo de 2026'

export default function TerminosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5]">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

          <div className="mb-10 border-b border-[#E5E5E5] pb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#586E26]">Legal</p>
            <h1 className="text-2xl font-bold text-[#0B0B0B] sm:text-3xl">Términos de Uso</h1>
            <p className="mt-3 text-sm text-[#6B6B6B]">Última actualización: {lastUpdated}</p>
          </div>

          <div className="mb-8 rounded-xl border border-[#E5E5E5] bg-white p-5">
            <p className="text-sm leading-relaxed text-[#6B6B6B]">
              Al acceder y utilizar el sitio web <strong className="text-[#0B0B0B]">BiuBan</strong> (en
              adelante, "el Sitio"), usted acepta los presentes Términos de Uso. Si no está de acuerdo
              con alguno de estos términos, le pedimos que no utilice el Sitio. BiuBan es un servicio
              gratuito de comparación de precios de moda en México; no vendemos, intermediamos ni
              gestionamos ninguna transacción comercial.
            </p>
          </div>

          <div className="space-y-8">

            <Section number="1" title="Descripción del Servicio">
              <p>BiuBan es una plataforma digital de comparación de precios de ropa, calzado y accesorios
              de moda disponibles en México. El Sitio recopila y presenta información de productos
              publicados por terceros (tiendas, marcas y marketplaces) con el único propósito de
              facilitar al usuario la búsqueda y comparación de opciones.</p>
              <p className="mt-3">BiuBan <strong className="text-[#0B0B0B]">no vende productos</strong>,
              no recibe pagos por transacciones, no almacena información de pago y no forma parte de
              ningún proceso de compra. Cuando el usuario hace clic en "Ver tienda", es redirigido al
              sitio web de la tienda correspondiente, donde la transacción ocurre de forma independiente
              y bajo los términos de dicha tienda.</p>
            </Section>

            <Section number="2" title="Uso Permitido">
              <p>El Sitio está destinado al uso personal y no comercial. Al utilizarlo, usted se
              compromete a:</p>
              <ul className="mt-3 space-y-2">
                <Li>Utilizar el Sitio únicamente para buscar y comparar precios de productos de moda.</Li>
                <Li>No reproducir, duplicar, copiar, vender ni explotar con fines comerciales ninguna
                parte del Sitio sin autorización escrita de BiuBan.</Li>
                <Li>No intentar acceder a sistemas, bases de datos o áreas restringidas del Sitio
                mediante medios no autorizados.</Li>
                <Li>No utilizar herramientas automatizadas (bots, scrapers, crawlers) para extraer
                información del Sitio sin autorización previa.</Li>
                <Li>No publicar, transmitir ni distribuir contenido ilegal, difamatorio, ofensivo o
                que infrinja derechos de terceros.</Li>
              </ul>
            </Section>

            <Section number="3" title="Exactitud de la Información">
              <p>BiuBan realiza esfuerzos razonables para mantener la información de precios,
              disponibilidad y características de los productos actualizada. Sin embargo, dada la
              naturaleza dinámica del comercio en línea,{' '}
              <strong className="text-[#0B0B0B]">no garantizamos</strong> que la información presentada
              sea exacta, completa o esté vigente en todo momento.</p>
              <p className="mt-3">Los precios, existencias, descuentos y condiciones de venta pueden
              cambiar en cualquier momento y sin previo aviso por parte de las tiendas. BiuBan no se
              hace responsable de discrepancias entre la información mostrada en el Sitio y la disponible
              en los sitios de las tiendas al momento de la compra.</p>
              <p className="mt-3">Se recomienda siempre verificar el precio final y las condiciones
              directamente en la tienda antes de realizar cualquier compra.</p>
            </Section>

            <Section number="4" title="Propiedad Intelectual">
              <p>Todo el contenido original del Sitio —incluyendo diseño, logotipos, textos, código
              fuente, interfaces y elementos visuales propios de BiuBan— es propiedad exclusiva de
              BiuBan y está protegido por las leyes de propiedad intelectual aplicables en México y
              tratados internacionales.</p>
              <p className="mt-3">Las marcas, logotipos, nombres comerciales e imágenes de productos
              pertenecen a sus respectivos propietarios. BiuBan no reclama propiedad sobre ninguno
              de ellos y su uso en el Sitio es estrictamente referencial con fines informativos
              y comparativos.</p>
            </Section>

            <Section number="5" title="Enlaces a Sitios de Terceros">
              <p>El Sitio contiene enlaces a sitios web de terceros (tiendas, marcas y marketplaces).
              Estos enlaces se proporcionan exclusivamente como referencia para el usuario. BiuBan no
              controla, respalda ni asume responsabilidad alguna por el contenido, políticas de
              privacidad, prácticas comerciales o seguridad de dichos sitios.</p>
              <p className="mt-3">Al hacer clic en un enlace externo, el usuario abandona el Sitio y
              queda sujeto a los términos y condiciones del sitio de destino. BiuBan recomienda revisar
              las políticas de cada tienda antes de realizar una compra.</p>
            </Section>

            <Section number="6" title="Limitación de Responsabilidad">
              <p>En la máxima medida permitida por la ley, BiuBan no será responsable por:</p>
              <ul className="mt-3 space-y-2">
                <Li>Pérdidas económicas derivadas de compras realizadas basándose en información
                del Sitio.</Li>
                <Li>Interrupciones, errores técnicos o indisponibilidad temporal del Sitio.</Li>
                <Li>Daños directos, indirectos, incidentales o consecuentes derivados del uso o
                imposibilidad de uso del Sitio.</Li>
                <Li>Actuaciones, omisiones o prácticas de las tiendas a las que se enlaza desde
                el Sitio.</Li>
                <Li>Virus u otros componentes dañinos que puedan transmitirse a través del Sitio
                o de los sitios enlazados.</Li>
              </ul>
              <p className="mt-3">El uso del Sitio es bajo el propio riesgo del usuario.</p>
            </Section>

            <Section number="7" title="Privacidad y Datos Personales">
              <p>El tratamiento de los datos personales que el usuario pueda proporcionar al utilizar
              el Sitio se rige por nuestra{' '}
                <Link href="/privacidad"
                  className="text-[#31470B] underline underline-offset-2 hover:text-[#586E26]">
                  Política de Privacidad
                </Link>
                , la cual forma parte integral de estos Términos de Uso.
              </p>
            </Section>

            <Section number="8" title="Modificaciones al Servicio y a los Términos">
              <p>BiuBan se reserva el derecho de modificar, suspender o descontinuar el Sitio —o
              cualquier parte de él— en cualquier momento y sin previo aviso, sin incurrir en
              responsabilidad frente al usuario.</p>
              <p className="mt-3">Asimismo, podemos actualizar estos Términos de Uso en cualquier
              momento. La versión vigente siempre estará disponible en esta página con la fecha de
              última actualización. El uso continuado del Sitio tras la publicación de cambios
              constituye la aceptación de los nuevos términos.</p>
            </Section>

            <Section number="9" title="Legislación Aplicable y Jurisdicción">
              <p>Estos Términos de Uso se rigen e interpretan de conformidad con las leyes vigentes
              en los <strong className="text-[#0B0B0B]">Estados Unidos Mexicanos</strong>. Para
              cualquier controversia derivada del uso del Sitio, las partes se someten a la
              jurisdicción de los tribunales competentes de la{' '}
              <strong className="text-[#0B0B0B]">Ciudad de México</strong>, renunciando a cualquier
              otro fuero que pudiera corresponderles.</p>
            </Section>

            <Section number="10" title="Contacto">
              <p>Si tiene preguntas sobre estos Términos de Uso, puede contactarnos a través de:</p>
              <p className="mt-3">
                <strong className="text-[#0B0B0B]">Correo electrónico:</strong>{' '}
                <a href="mailto:hola@biuban.mx"
                  className="text-[#31470B] hover:text-[#586E26]">
                  hola@biuban.mx
                </a>
              </p>
              <p className="mt-1 text-xs text-[#6B6B6B]">
                Tiempo de respuesta estimado: 3 a 5 días hábiles.
              </p>
            </Section>

          </div>

          <div className="mt-12 flex items-center justify-between border-t border-[#E5E5E5] pt-6 text-sm">
            <Link href="/" className="text-[#6B6B6B] transition-colors hover:text-[#31470B]">
              ← Volver al inicio
            </Link>
            <Link href="/privacidad" className="text-[#31470B] transition-colors hover:text-[#586E26]">
              Política de Privacidad →
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