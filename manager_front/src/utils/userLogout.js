import { logoutAPI } from "@apis/authAPIs";

function userLogout(router, clearQueries) {
  const logout = async () => {
    const data = {
      lType: "99",
    };

    await logoutAPI(data);
    router.push("/");
    clearQueries();
  };

  logout();

  return;
}

export default userLogout;
