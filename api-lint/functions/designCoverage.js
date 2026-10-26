// Мінімальний обсяг проєкту API (практична робота № 4):
// колекція з пагінацією, створення (201), читання, часткове оновлення, видалення,
// вкладена колекція і дія над ресурсом (x-kss-action).
export default (paths) => {
  const entries = Object.entries(paths ?? {}).filter(([p]) => p !== "/auth/login");
  const has = (pred) => entries.some(([p, item]) => pred(p, item ?? {}));
  const isItem = (p) => /\}$/.test(p);
  const segments = (p) => p.split("/").filter(Boolean);
  const checks = [
    ["GET колекції зі сторінками", has((p, i) => !isItem(p) && i.get?.parameters?.some((x) => x?.name === "page"))],
    ["POST, що створює ресурс (201)", has((_p, i) => i.post?.responses?.["201"])],
    ["GET окремого ресурсу /{…Id}", has((p, i) => isItem(p) && i.get)],
    ["PATCH для часткового оновлення", has((p, i) => isItem(p) && i.patch)],
    ["DELETE ресурсу", has((p, i) => isItem(p) && i.delete)],
    ["вкладена колекція /ресурси/{id}/підресурси", has((p, i) => !isItem(p) && segments(p).length >= 3 && segments(p).some((s) => s.startsWith("{")) && i.get)],
    ["дія над ресурсом (x-kss-action: true)", has((_p, i) => i.post?.["x-kss-action"] === true)],
  ];
  return checks.filter(([, ok]) => !ok).map(([what]) => ({ message: `Бракує: ${what}`, path: ["paths"] }));
};
