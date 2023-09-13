import React, { useState } from "react";
import { QueryClient, QueryClientProvider, Hydrate } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import GlobalStyle from "@src/styles/globalStyle";
import SSRProvider from "react-bootstrap/SSRProvider";
import Head from "next/head";
import { ThemeProvider } from "styled-components";
import theme from "@src/styles/theme";

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
                <title>Data Nursery</title>
              </Head>
              <Component {...pageProps} />
            </ThemeProvider>
          </RecoilRoot>
        </SSRProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
