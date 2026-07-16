import { createFileRoute, Link } from "@tanstack/react-router";

const TITLE = "ByeBets — Responsabilidade Civil das Bets";
const DESCRIPTION =
  "Como a lei brasileira protege quem perdeu dinheiro em apostas online: princípios, hipóteses de indenização e perguntas frequentes.";

export const Route = createFileRoute("/direitos")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: "/logo.png" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: DireitosPage,
});

const PRINCIPLES = [
  {
    num: "01",
    title: "Você é consumidor",
    text: "A lei trata o apostador como consumidor e a bet como fornecedora de serviço — o que atrai regras de proteção e responsabilidade objetiva.",
  },
  {
    num: "02",
    title: "Um dever descumprido",
    text: "Ausência de barreiras de segurança, triagem, alertas ou resposta a pedidos de autoexclusão configura defeito no serviço prestado.",
  },
  {
    num: "03",
    title: "Ligação com o dano",
    text: "É preciso demonstrar que a falha da plataforma teve relação direta com a perda financeira ou o agravamento sofrido pelo consumidor.",
  },
];

const CASES = [
  {
    tag: "Devolução dos valores",
    title: "Pedido de autoexclusão ignorado",
    fato: "Você pediu para bloquear sua conta ou pausar as apostas, e a plataforma não atendeu ou demorou para processar o pedido.",
    fundamento:
      "Lei 14.790/2023, art. 23 (dever de autoexclusão) c/c Código de Defesa do Consumidor, art. 14.",
    provas:
      "Prints de chat, protocolo de atendimento ou e-mail com data do pedido.",
    consequencia:
      "Devolução dos valores apostados após o pedido não atendido, além de eventual dano moral.",
  },
  {
    tag: "Nulidade das apostas",
    title: "Diagnóstico de ludopatia (vício em jogo)",
    fato: "Você apostou de forma compulsiva e possui (ou veio a ter) diagnóstico médico de transtorno do jogo.",
    fundamento:
      "Lei 14.790/2023, art. 26, VI (nulidade de pleno direito) c/c Código Civil, arts. 166 e 171.",
    provas:
      "Laudo médico e histórico de apostas mostrando padrão compulsivo, mesmo que o diagnóstico formal seja posterior.",
    consequencia:
      "Nulidade das apostas e devolução integral dos valores movimentados no período.",
  },
  {
    tag: "Presunção de falha",
    title: "Cadastro sem triagem de perfil de risco",
    fato: "A plataforma liberou sua conta sem aplicar (ou sem conseguir comprovar) o questionário de autoavaliação exigido por lei.",
    fundamento:
      "Lei 14.790/2023, arts. 23 e 26 c/c Código de Defesa do Consumidor, art. 14, §1º.",
    provas:
      "A própria ausência do documento nos autos já favorece o consumidor — o ônus de provar o cumprimento é da bet.",
    consequencia:
      "Presunção de falha na prestação do serviço, com inversão do ônus da prova.",
  },
  {
    tag: "Dano moral",
    title: "Publicidade dirigida a quem pediu para parar",
    fato: "Você recebeu ofertas, bônus ou notificações mesmo após sinalizar vulnerabilidade ou pedir autoexclusão.",
    fundamento:
      "Lei 14.790/2023, arts. 16 e 17 c/c Código de Defesa do Consumidor, arts. 37 e 39, IV.",
    provas:
      "Prints de e-mails, push notifications ou mensagens promocionais com data posterior ao pedido de bloqueio.",
    consequencia:
      "Dano moral autônomo, somado a possível nulidade dos bônus oferecidos.",
  },
  {
    tag: "Defeito do serviço",
    title: "Nenhum alerta sobre risco de dependência",
    fato: "A interface da plataforma não exibe avisos, limites de tempo ou de valor, nem orientações de jogo responsável.",
    fundamento:
      "Lei 14.790/2023, art. 23 c/c Código de Defesa do Consumidor, art. 6º, III.",
    provas:
      "Comparação entre a interface usada e as exigências legais de aviso e limite.",
    consequencia:
      "Defeito do serviço, reforçando o nexo causal em ações de dano material e moral.",
  },
  {
    tag: "Nulidade absoluta",
    title: "Conta aberta por menor de idade",
    fato: "Um menor de idade conseguiu criar conta e apostar, sem verificação eficaz de idade.",
    fundamento: "Lei 14.790/2023 c/c Código Civil, arts. 3º e 4º.",
    provas:
      "Documento de identidade do titular da conta e ausência de verificação (KYC) pela plataforma.",
    consequencia:
      "Nulidade absoluta do negócio e devolução integral dos valores apostados.",
  },
  {
    tag: "Pagamento do valor retido",
    title: "Saque retido sem justificativa",
    fato: "Você solicitou o saque de valores disponíveis e a plataforma atrasou ou reteve o pagamento sem motivo claro.",
    fundamento:
      "Código de Defesa do Consumidor, arts. 14 e 39, IV c/c Código Civil, art. 389.",
    provas:
      "Extrato de saldo, protocolo do pedido de saque e prazo regulamentar descumprido.",
    consequencia:
      "Pagamento do valor retido, com correção e juros; dano moral em caso de reiteração.",
  },
  {
    tag: "Nulidade da cláusula",
    title: "Bônus com condições ocultas ou abusivas",
    fato: "O bônus prometido tinha rollover excessivo, condições não informadas claramente ou foi cancelado unilateralmente.",
    fundamento:
      "Código de Defesa do Consumidor, art. 51, IV e §1º c/c Código Civil, art. 421.",
    provas: "Termos da promoção divulgados versus condições realmente aplicadas.",
    consequencia: "Nulidade da cláusula abusiva, mantendo o restante do contrato.",
  },
];

const FAQ = [
  {
    q: "Eu sou maior de idade e escolhi apostar. Ainda assim posso ter direito à devolução?",
    a: "Sim, quando a plataforma descumpriu deveres legais específicos — como não atender a um pedido de autoexclusão, não aplicar triagem de risco ou insistir em publicidade após sinais de vulnerabilidade. A responsabilidade não depende apenas de a aposta ter sido voluntária.",
  },
  {
    q: "Meu diagnóstico de ludopatia veio depois do período em que apostei. Isso invalida meu caso?",
    a: "Não necessariamente. Os tribunais têm reconhecido que o diagnóstico formal costuma ser posterior ao início dos sintomas, e sinais anteriores de vulnerabilidade podem sustentar o pedido mesmo que o laudo definitivo seja de data posterior.",
  },
  {
    q: "Preciso provar tudo sozinho?",
    a: "Não. Em relações de consumo, quando a alegação é verossímil, o ônus de provar que cumpriu a lei pode ser transferido para a plataforma — por exemplo, cabe a ela comprovar que aplicou o questionário de triagem, não a você provar que ela não aplicou.",
  },
  {
    q: "Que documentos devo guardar desde já?",
    a: "Prints de conversas com o suporte, comprovantes de depósito e saque, laudos médicos (se houver) e qualquer comunicação em que você tenha pedido bloqueio, pausa ou autoexclusão da conta.",
  },
];

function DireitosPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-line bg-[rgba(255,255,255,0.92)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <Link to="/" className="flex items-center no-underline">
            <img
              src="/logo.png"
              alt="ByeBets — Escolhas hoje. Liberdade sempre."
              className="h-14 w-auto"
            />
          </Link>
          <Link
            to="/"
            className="rounded-full bg-blue-electric px-5 py-2.5 text-sm font-semibold text-white no-underline shadow-[var(--shadow-blue)] transition-all hover:-translate-y-0.5 hover:bg-navy-700"
          >
            Avaliar meu caso
          </Link>
        </div>
      </header>

      <section className="relative bg-gradient-to-b from-tint to-white px-6 pb-16 pt-16 sm:pb-20 sm:pt-24">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-tint-deep px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-navy-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-electric" />
            Apostas esportivas e cassino online
          </span>
          <h1 className="mt-6 font-serifDisplay text-[38px] font-semibold leading-[1.1] text-ink sm:text-[54px]">
            Perdeu valores em uma plataforma de apostas?{" "}
            <em className="bg-gradient-to-b from-transparent from-[62%] to-tint-deep to-[62%] font-normal italic text-navy-700">
              A bet também responde por isso.
            </em>
          </h1>
          <p className="mt-6 max-w-2xl text-[18px] text-ink-soft sm:text-[19px]">
            A lei brasileira não deixa o apostador desamparado. As casas de apostas têm
            deveres legais de proteção, prevenção e transparência — e quando falham em
            cumpri-los, podem ser condenadas a devolver valores e a indenizar danos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#casos"
              className="rounded-full bg-navy-900 px-7 py-3.5 text-sm font-semibold text-white no-underline shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-navy-700 hover:shadow-[var(--shadow-elevated)]"
            >
              Ver hipóteses de indenização
            </a>
            <Link
              to="/"
              className="rounded-full border-[1.5px] border-line bg-transparent px-7 py-3.5 text-sm font-semibold text-navy-900 no-underline transition-all hover:-translate-y-0.5 hover:border-navy-500 hover:bg-tint"
            >
              Fazer avaliação gratuita
            </Link>
          </div>
        </div>
      </section>

      <section id="principios" className="border-t border-line px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-gold-deep">
              Como a responsabilidade se forma
            </div>
            <h2 className="mt-3 font-serifDisplay text-[30px] font-semibold text-ink sm:text-[38px]">
              Três elementos que sustentam uma condenação
            </h2>
            <p className="mt-3 text-[16.5px] text-ink-soft">
              Não é qualquer perda que gera indenização. Os tribunais examinam se a
              plataforma falhou em deveres específicos previstos em lei — e se essa falha
              causou o dano.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div
                key={p.num}
                className="rounded-[14px] border border-line bg-tint p-7 transition-all hover:-translate-y-1 hover:border-navy-500 hover:bg-white hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-navy-700">
                  {p.num}
                </div>
                <h3 className="mt-2 font-serifDisplay text-[20px] font-semibold text-ink">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-[15px] text-ink-soft">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="casos" className="border-t border-line bg-tint px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-gold-deep">
              Quadro fático-jurídico
            </div>
            <h2 className="mt-3 font-serifDisplay text-[30px] font-semibold text-ink sm:text-[38px]">
              Situações em que a bet pode ser responsabilizada
            </h2>
            <p className="mt-3 text-[16.5px] text-ink-soft">
              Cada item abaixo reúne o fato que costuma gerar o direito à indenização, o
              fundamento legal correspondente e o que normalmente é exigido para
              comprová-lo.
            </p>
          </div>
          <div className="mt-10 space-y-3">
            {CASES.map((c) => (
              <details
                key={c.title}
                className="group overflow-hidden rounded-[14px] border border-line bg-white transition-all open:border-navy-500 open:shadow-[var(--shadow-elevated)]"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="whitespace-nowrap rounded-full bg-navy-900 px-3 py-1.5 text-xs font-bold text-white">
                    {c.tag}
                  </span>
                  <span className="font-serifDisplay text-[17px] font-semibold text-ink">
                    {c.title}
                  </span>
                  <span className="ml-auto flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-tint text-lg text-navy-700 transition-all group-open:bg-navy-900 group-open:text-white">
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">–</span>
                  </span>
                </summary>
                <div className="px-6 pb-7">
                  {[
                    ["O que aconteceu", c.fato],
                    ["Fundamento", c.fundamento],
                    ["O que costuma comprovar", c.provas],
                    ["Consequência", c.consequencia],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="mb-4 grid gap-1 text-[15px] last:mb-0 sm:grid-cols-[160px_1fr] sm:gap-4"
                    >
                      <div className="pt-0.5 text-xs font-bold uppercase tracking-wider text-navy-700">
                        {label}
                      </div>
                      <div className="text-ink-soft">{value}</div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="perguntas" className="border-t border-line px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-gold-deep">
              Dúvidas comuns
            </div>
            <h2 className="mt-3 font-serifDisplay text-[30px] font-semibold text-ink sm:text-[38px]">
              Perguntas frequentes
            </h2>
          </div>
          <div className="mt-10">
            {FAQ.map((f, i) => (
              <div
                key={f.q}
                className={`py-7 ${i === 0 ? "pt-0" : "border-t border-line"}`}
              >
                <h4 className="font-serifDisplay text-[19px] font-semibold text-ink">
                  {f.q}
                </h4>
                <p className="mt-2.5 max-w-[720px] text-[15.5px] text-ink-soft">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-navy-950 to-navy-900 px-6 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-gold">
            Próximo passo
          </div>
          <h2 className="mt-3 font-serifDisplay text-[32px] font-semibold text-white sm:text-[40px]">
            Descubra em 3 minutos se seu caso é elegível
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[16.5px] text-[#AEBEDA]">
            Nossa avaliação usa uma pontuação técnica baseada em perdas, indícios de
            ludopatia, provas e conduta da plataforma para classificar seu caso.
          </p>
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex rounded-full bg-gold px-8 py-4 text-[15.5px] font-semibold text-navy-950 no-underline shadow-[var(--shadow-elevated)] transition-all hover:-translate-y-0.5 hover:bg-[oklch(0.8_0.12_82)]"
            >
              Iniciar avaliação gratuita →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-tint px-6 py-10">
        <div className="mx-auto max-w-6xl text-[13px] leading-relaxed text-ink-soft">
          <strong className="font-semibold text-ink">Aviso legal:</strong> Conteúdo
          informativo, sem valor de consulta jurídica individualizada. A responsabilidade
          civil das plataformas de apostas é analisada caso a caso à luz do CDC, do Código
          Civil e da Lei nº 14.790/2023.
        </div>
      </footer>
    </div>
  );
}
