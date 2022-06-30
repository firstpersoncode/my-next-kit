const components = {
  ComponentName: require("./ComponentName").default,
  ComponentDemo: require("./ComponentDemo").default
};

export default function Content({ component }) {
  const SelectedComponent = components[component.__typename];
  if (SelectedComponent) return <SelectedComponent component={component} />;

  return <div>Component not found: {component.__typename}</div>;
}
