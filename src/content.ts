export const content = {
  name: "Variable Land",
  line: ["A place where ideas are variables.", "Welcome to the land of possibility."],
  lab: {
    name: "Variable Lab",
    role: "Our open-source arm",
    href: "https://lab.variable.land",
    host: "lab.variable.land",
  },
} as const;

export const description = content.line.join(" ");
