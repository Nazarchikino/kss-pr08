// Відповіді 4xx і 5xx описують помилку у форматі application/problem+json (RFC 9457).
export default (responses, _options, context) => {
  const errors = [];
  for (const [code, response] of Object.entries(responses ?? {})) {
    if (!/^[45]/.test(code)) continue;
    const types = Object.keys(response?.content ?? {});
    if (!types.includes("application/problem+json")) {
      errors.push({ message: `Відповідь ${code} має тип вмісту application/problem+json`, path: [...context.path, code] });
    }
  }
  return errors;
};
