export interface Plugin {
  id: string;
  name: string;
  component: React.ComponentType<any>;
}
