export type Flow = {
  uuid: string;
};

export enum View {
  Step1 = "STEP_1",
  Step2 = "STEP_2",
  Step3 = "STEP_3",
}

export enum Action {
  Init = "INIT",
  Next = "NEXT",
  Back = "BACK",
  Logout = "LOGOUT",
}

export const gql = (q) => q.join();
