import React, { useState } from "react";
import { QueryClient, QueryClientProvider, Hydrate } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import GlobalStyle from "@src/styles/globalStyle";
import SSRProvider from "react-bootstrap/SSRProvider";
import Head from "next/head";
import { ThemeProvider } from "styled-components";
import theme from "@src/styles/theme";
import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

export default function App({ Component, pageProps }) {
  // 사용자별 요청 데이터 공유 안되게
  const [queryClient] = useState(() => new QueryClient(), {
    defaultOptions: {
      queries: {
        retry: 0, // 호출 실패 시 재시도 하는 횟수
        // enabled, // 동기 설정, False로 할 시 최초 선언시 호출을 안함, True일 시 최초 선언 시 호출함
        refetchOnWindowFocus: false, // window가 다시 포커스 될때
        refetchOnMount: false, // 데이터가 stale 상태일 경우 마운트시마다 refetch 실행
        refetchOnReconnect: false, // 네트워크가 끊어졌다가 다시 연결될 때
        refetchInterval: false, // 쿼리에 refetch interval이 설정되어 있을 때
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <SSRProvider>
          <RecoilRoot>
            <ThemeProvider theme={theme}>
              <GlobalStyle />
              <Head>
                <title>Data Nursery - Admin</title>
                {/* <meta name="description" content="대한민국 NO.1 자동파종기 관리 시스템"/>
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Data Nursery - Admin" />
                <meta property="og:locale" content="ko_KR" />
                <meta property="og:image:width" content="800" />
                <meta property="og:image:height" content="401" />
                <meta property="og:url" content="https://admin.datanursery.kr/login" />
                <meta property="og:title" content="Data Nursery - Admin" />
                <meta property="og:image" content="/images/og/og-img-kakao.svg" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=0" /> */}
              </Head>
              <Component {...pageProps} />
            </ThemeProvider>
          </RecoilRoot>
        </SSRProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
