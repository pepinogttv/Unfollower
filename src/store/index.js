import Vue from "vue";
import Vuex from "vuex";
import pathify from "vuex-pathify";
import { make } from "vuex-pathify";
import storage from "../services/storage";

pathify.options.mapping = "standard";
pathify.options.deep = 2;

Vue.use(Vuex);

const users_info = storage.getUsersInfo();

const state = {
  account: users_info && users_info.length === 1 ? users_info[0] : null,
  accounts: users_info ?? [],
  actionInQty: '',
  actionInQtyCurrentLoadingStart: null,
  actionInQtyCurrentLoadingEnd: null
};
const mutations = make.mutations(state);
const actions = {
  ...make.actions(state),
  setAccount({ commit, state }, { account, keep }) {
    if (keep) storage.saveUserInfo(account);
    commit("SET_ACCOUNT", account);
    if (state.accounts) {
      const stored = state.accounts.find((ac) => ac.pk === account.pk);
      if (stored) return;
      commit("SET_ACCOUNTS", [...state.accounts, account]);
    } else {
      commit("SET_ACCOUNTS", [account]);
    }
  },
  deleteAccount({ commit, state }, account) {
    commit("SET_ACCOUNT", null);

    const accountsWithoutDeleted = state.accounts.filter(
      ({ pk }) => !(account.pk === pk)
    );
    commit("SET_ACCOUNTS", accountsWithoutDeleted);
    storage.updateAccounts(accountsWithoutDeleted);
  },
};

export default new Vuex.Store({
  plugins: [pathify.plugin],
  state,
  mutations,
  actions,
});
