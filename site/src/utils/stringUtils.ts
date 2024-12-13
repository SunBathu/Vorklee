// Capitalizes the first letter of a string and returns a default value if the string is null or undefined
export const capitalizeFirstLetter = (
  str: string | null | undefined,
  defaultValue: string = '',
) => {
  if (!str) return defaultValue;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
