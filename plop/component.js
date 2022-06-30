const plopConfigs = plop => {
  plop.setGenerator("component", {
    description: "Create Component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name (PascalCase)"
      }
    ],
    actions: [
      {
        type: "add",
        path: "../component/{{pascalCase name}}/README.md",
        templateFile: "templates/README.md.hbs"
      },
      {
        type: "add",
        path: "../component/{{pascalCase name}}/index.jsx",
        templateFile: "templates/index.jsx.hbs"
      },
      {
        type: "add",
        path: "../component/{{pascalCase name}}/index.scss",
        templateFile: "templates/index.scss.hbs"
      },
      {
        type: "add",
        path: "../component/{{pascalCase name}}/context.jsx",
        templateFile: "templates/context.jsx.hbs"
      },
      {
        type: "add",
        path: "../component/{{pascalCase name}}/__tests__/index.test.jsx",
        templateFile: "templates/index.test.jsx.hbs"
      }
    ]
  });
};

module.exports = plopConfigs;
