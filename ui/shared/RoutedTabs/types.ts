export interface RoutedTab {
  id: string;
  title: string;
  component: React.ReactNode;
  subTabs?: Array<string>;
}

export type RoutedSubTab = Omit<RoutedTab, 'subTabs'>;

export interface MenuButton {
  id: null;
  title: string;
  component: null;
}
