// Колекції повертаються сторінками: об'єкт { items, page, pageSize, total }, а не «голий» масив;
// операція, що повертає сторінку, приймає параметри page і pageSize.
export default (operation, _options, context) => {
  const schema = operation?.responses?.["200"]?.content?.["application/json"]?.schema;
  if (!schema) return [];
  const at = [...context.path, "responses", "200"];
  if (schema.type === "array") {
    return [{ message: "Повертайте сторінку { items, page, pageSize, total } замість масиву", path: at }];
  }
  const isPage = schema.properties?.items?.type === "array";
  if (!isPage) return [];
  const names = (operation.parameters ?? []).map((p) => p?.name);
  const missing = ["page", "pageSize"].filter((n) => !names.includes(n));
  const props = ["page", "pageSize", "total"].filter((n) => !schema.properties?.[n]);
  const errors = [];
  if (missing.length) errors.push({ message: `Операція зі сторінкою має приймати параметри: ${missing.join(", ")}`, path: [...context.path, "parameters"] });
  if (props.length) errors.push({ message: `Схема сторінки має містити поля: ${props.join(", ")}`, path: at });
  return errors;
};
