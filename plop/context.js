const plopConfigs = plop => {
  plop.setGenerator("context", {
    description: "Create Context",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Context name (PascalCase)"
      }
    ],
    actions: [
      {
        type: "add",
        path: "../context/{{pascalCase name}}/README.md",
        templateFile: "templates/README.md.hbs"
      },
      {
        type: "add",
        path: "../context/{{pascalCase name}}/index.jsx",
        templateFile: "templates/context.jsx.hbs"
      }
    ]
  });
};

module.exports = plopConfigs;
