const PROVISIONS = [
  "Забрана за рекламирање на излозите на коцкарниците.",
  "Забрана за реклами што коцкањето го прикажуваат како пат до личен успех или брза заработка.",
  "Забрана за рекламирање преку познати личности.",
  "Задолжителен GPS на секој апарат — за тековна контрола од Управата за јавни приходи (УЈП).",
  "Лиценците не може да се мултиплицираат.",
  "Финансиски давачки за нови уплатно-исплатни места и повисоки банкарски гаранции.",
  "Имплементација на препораките на MONEYVAL (Совет на Европа).",
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
      {children}
    </section>
  );
}

export default function LawPanel() {
  return (
    <div className="space-y-5 text-sm leading-relaxed text-slate-300">
      <Section title="За законот">
        <p>
          Новиот Закон за игри на среќа е усвоен во Собранието во 2026 година
          со 59 гласа „За“ и 9 „Против“.
        </p>
      </Section>

      <Section title="Правилото од 500 метри">
        <p>
          Казината, автомат клубовите и приредувачите на електронски игри на
          среќа мора да бидат оддалечени најмалку{" "}
          <strong className="text-slate-100">500 метри (радиус)</strong> од
          сите основни и средни училишта. Објектите во радиусот{" "}
          <strong className="text-red-400">мора да се релоцираат</strong>.
        </p>
        <p>
          Обложувалниците (уплатно-исплатни места) во радиусот остануваат, но{" "}
          <strong className="text-amber-400">со ограничување</strong> —
          забранети се видеолотариските терминали (VLT) и опремата за
          електронски игри на среќа.
        </p>
      </Section>

      <Section title="Како се мери растојанието">
        <p>
          Праволиниски (радиус), според формулацијата „радиус до 500 метри“ во
          законот — не по пешачка патека. Се мери до најблиското училиште. Ако
          подзаконски акт пропише друг метод на мерење, пресметката ќе се
          ажурира.
        </p>
      </Section>

      <Section title="Други одредби">
        <ul className="list-disc space-y-1 pl-5">
          {PROVISIONS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </Section>

      <Section title="Извори">
        <ul className="space-y-1">
          <li>
            <a
              href="https://finance.gov.mk/mk-MK/oblasti/licenci-za-igri-na-srekja"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 underline hover:text-indigo-300"
            >
              Министерство за финансии — лиценци за игри на среќа
            </a>
          </li>
          <li>
            <a
              href="http://ujp.gov.mk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 underline hover:text-indigo-300"
            >
              Управа за јавни приходи (УЈП)
            </a>
          </li>
          <li>
            <a
              href="https://www.sobranie.mk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 underline hover:text-indigo-300"
            >
              Собрание на Северна Република Македонија
            </a>
          </li>
        </ul>
      </Section>

      <Section title="Дисклејмер">
        <p className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs text-slate-400">
          Ова е информативна алатка, не официјален документ. Меродавни се
          регистрите на Министерството за финансии и УЈП. Локациите означени
          како „непроверени“ не се потврдени и не треба да се толкуваат како
          факт.
        </p>
      </Section>
    </div>
  );
}
