const PROVISIONS = [
  "Забрана за рекламирање на излозите на коцкарниците.",
  "Забрана за реклами што коцкањето го прикажуваат како пат до личен успех или брза заработка.",
  "Забрана за рекламирање преку познати личности.",
  "Задолжителен GPS на секој апарат - за тековна контрола од Управата за јавни приходи (УЈП).",
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
          <strong className="text-amber-400">со ограничување</strong> -
          забранети се видеолотариските терминали (VLT) и опремата за
          електронски игри на среќа.
        </p>
      </Section>

      <Section title="Како се мери растојанието">
        <p>
          Праволиниски (радиус), според формулацијата „радиус до 500 метри“ во
          законот - не по пешачка патека. Се мери до најблиското училиште. Ако
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

      <Section title="Извори на податоците">
        <ul className="space-y-2 text-xs">
          <li>
            <strong className="text-slate-200">
              Објекти за игри на среќа:
            </strong>{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 underline hover:text-indigo-300"
            >
              OpenStreetMap
            </a>{" "}
            (© OpenStreetMap contributors, лиценца ODbL) и објавените лиценци
            на{" "}
            <a
              href="https://arhiva.finance.gov.mk/%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D1%86%D0%B8-%D0%B7%D0%B0-%D0%BF%D1%80%D0%B8%D1%80%D0%B5%D0%B4%D1%83%D0%B2%D0%B0%D1%9A%D0%B5-%D0%B8%D0%B3%D1%80%D0%B8-%D0%BD%D0%B0-%D1%81%D1%80%D0%B5%D1%9C%D0%B0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 underline hover:text-indigo-300"
            >
              Министерството за финансии (архива)
            </a>
            . Кај објектите од лиценците адресите се претворени во координати
            преку{" "}
            <a
              href="https://nominatim.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 underline hover:text-indigo-300"
            >
              Nominatim
            </a>{" "}
            - кај секој објект во попапот стои изворот и линк до самата
            лиценца (PDF) каде што постои.
          </li>
          <li>
            <strong className="text-slate-200">Училишта:</strong>{" "}
            OpenStreetMap (amenity=school), со автоматско отстранување
            дупликати и установи што не се основни/средни училишта. Поделбата
            основно/средно е изведена од името и може да содржи грешки.
          </li>
          <li>
            <strong className="text-slate-200">Граници на општини:</strong>{" "}
            OpenStreetMap (admin_level=7, сите 80 општини).
          </li>
          <li>
            <strong className="text-slate-200">Надлежни институции:</strong>{" "}
            <a
              href="https://finance.gov.mk/mk-MK/oblasti/licenci-za-igri-na-srekja"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 underline hover:text-indigo-300"
            >
              Министерство за финансии
            </a>
            ,{" "}
            <a
              href="http://ujp.gov.mk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 underline hover:text-indigo-300"
            >
              УЈП
            </a>
            ,{" "}
            <a
              href="https://www.sobranie.mk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 underline hover:text-indigo-300"
            >
              Собрание
            </a>
            .
          </li>
          <li className="text-slate-400">
            Податоците се извлечени на <strong>12 јуни 2026</strong> и не се
            ажурираат автоматски.
          </li>
        </ul>
      </Section>

      <Section title="Одрекување од одговорност">
        <div className="space-y-2 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 text-xs text-slate-400">
          <p>
            Оваа страница е информативна алатка изработена од граѓани - не е
            официјален документ и не е поврзана со државна институција.
          </p>
          <p>
            Статусите на објектите се автоматска пресметка на праволиниско
            растојание и <strong>не претставуваат правна квалификација</strong>{" "}
            ниту тврдење дека конкретен објект работи незаконски. Меродавни се
            единствено регистрите и решенијата на Министерството за финансии и
            УЈП.
          </p>
          <p>
            Локациите не се теренски проверени („непроверена локација“) -
            возможни се грешки во положба, име, тип и актуелност. Регистарот на
            лиценци може да е нецелосен или застарен, а мрежата на
            уплатно-исплатни места не е јавно објавена во целост.
          </p>
          <p>
            Ако забележите грешка, контактирајте ги изворите или пријавете
            корекција во OpenStreetMap.
          </p>
        </div>
      </Section>
    </div>
  );
}
