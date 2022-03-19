import { initStore } from "./store";

const configureStore = () => {
  const actions = {
    SET_LOADING: (currentState, newState) => {
      return { loading: newState };
    },
    SET_FORM_OPEN: (currentState, newState) => {
      return { formOpen: newState };
    },
    SET_FORM_OPTION: (currentState, newState) => {
      return { formOption: newState };
    },
    SET_PROJECT_ID: (currentState, newState) => {
      return { projectID: newState };
    },
  };
  initStore(actions, {
    loading: false,
    formOpen: false,
    formOption: "",
    projectID: "",
  });
};

export default configureStore;
