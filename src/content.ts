export const content = {
  name: "Variable Land",
  statement: {
    first: "A place where ideas are variables.",
    second: "Welcome to the land of possibility.",
  },
  legendLabel: "About",
  lab: {
    name: "Variable Lab",
    role: "Our open-source arm",
    href: "https://lab.variable.land",
    host: "lab.variable.land",
  },
} as const;

export const description = `${content.statement.first} ${content.statement.second}`;
