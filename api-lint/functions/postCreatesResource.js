// POST, що створює ресурс, повертає 201 і заголовок Location.
// POST-дія (зміна стану, вхід) позначається розширенням x-kss-action: true і повертає 200 або 204.
export default (pathItem, _options, context) => {
  const post = pathItem?.post;
  if (!post || typeof post !== "object") return [];
  const responses = post.responses ?? {};
  const at = [...context.path, "post", "responses"];
  if (post["x-kss-action"] === true) {
    return responses["200"] || responses["204"]
      ? []
      : [{ message: "POST-дія (x-kss-action) має повертати 200 або 204", path: at }];
  }
  if (!responses["201"]) {
    return [{ message: "POST, що створює ресурс, повертає 201 Created (для дії позначте операцію x-kss-action: true)", path: at }];
  }
  if (!responses["201"].headers?.Location) {
    return [{ message: "Відповідь 201 має містити заголовок Location з адресою нового ресурсу", path: [...at, "201"] }];
  }
  return [];
};
