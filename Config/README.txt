Настройки внешнего вида сайта

Файл: Config/cosmetics.js

Снегопад:

enabled: true    — снегопад включён
enabled: false   — снегопад выключен

Количество снежинок:

desktop: 26          — компьютеры
tablet: 18           — планшеты и небольшие экраны
mobile: 12           — телефоны
lowPerformance: 12   — слабые устройства

Пример:

window.SiteCosmetics = {
  snowfall: {
    enabled: true,
    flakes: {
      desktop: 26,
      tablet: 18,
      mobile: 12,
      lowPerformance: 12
    }
  }
};

Максимально допустимое значение ограничено 150 снежинками.
