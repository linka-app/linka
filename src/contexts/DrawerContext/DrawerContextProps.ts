export interface IDrawer {
  open?: boolean;
  children: React.ReactNode;
}

export type DrawerContextType = {
  doDrawer: (drawerMessage: IDrawer) => void;
  doDrawerClose: () => void;
  getDrawerState: () => boolean;
};
