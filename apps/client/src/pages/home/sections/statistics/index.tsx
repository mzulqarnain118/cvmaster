import { t } from "@lingui/macro";

import { Counter } from "./counter";

type Statistic = {
  name: string;
  value: number | string; // Allow value to be either a number or a string
};

export const StatisticsSection = () => {
  const stats: Statistic[] = [
    { name: t`Job applications created`, value: "41M+" },
    { name: t`Free career guides`, value: 1400 },
    { name: t`Readers a year`, value: "41M+"},
    { name: t`Career Experts`, value: 30 },
    { name: t`Years in business`, value: 10},
  
  ];

  return (
    <section id="statistics" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-5">
          {stats.map((stat, index) => (
            <div key={index} className="mx-auto flex max-w-xs flex-col gap-y-3">
              <dt className="text-base leading-7 opacity-60">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight sm:text-5xl">
                {typeof stat.value === "number" ? (
                  <>
                    <Counter from={0} to={stat.value} />+ {/* Add the plus symbol for numbers */}
                  </>
                ) : (
                  stat.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
