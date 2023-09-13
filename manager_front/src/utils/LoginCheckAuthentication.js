// 로그인, 회원가입 페이지 진입 시 로그인 상태라면 /main 페이지로 이동
export function loginCheckAuthentication(gssp) {
  return async (context) => {
    const { req, res } = context;
    const token = req.cookies._taa;
    if (!!token) {
      return {
        redirect: {
          destination: "/",
          statusCode: 302,
        },
      };
    }

    return await gssp(context);
  };
}

// 로그인이 필요한 페이지라면 확인 후 로그인 안되있을 시 로그인페이지로 이동
export function requireAuthentication(gssp) {
  return async (context) => {
    const { req, res } = context;
    const token = req.cookies._taa;

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          statusCode: 302,
        },
      };
    }

    return await gssp(context);
  };
}
