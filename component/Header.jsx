import { useCmsContext } from "context/Cms";

export default function Header() {
  const { appName } = useCmsContext();

  return <header>App: {appName}</header>;
}
