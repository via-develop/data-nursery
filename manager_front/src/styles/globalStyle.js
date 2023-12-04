import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset};
  
  html,
  body {
    /* width: 100%; */
    height: 100%;
    min-width: 1920px;

    * {
    font-family: Pretendard;
    }

    ::-webkit-scrollbar {
      display: none;
    }
  }
  
  #root {
    margin: 0 auto;
  }
  
  html {
    font-size: 16px;
  }
  
  * {
    box-sizing: border-box;
  }

  body, button {
    /* 후에 폰트 공유받은 후 공유받은 폰트로 변경하기 */
    /* font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Pretendard, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
    Helvetica Neue, sans-serif; */
    font-family: Pretendard;
    font-weight: 400;
    
    /* p {
      margin: 0;
    } */

    p, h1, h2, h3, h4, h5, h6, span {
      color: #000;
      margin: 0;
    }


  }

  
  button {
    cursor: pointer;
    border: none;
    outline: none;
    background-color: transparent;
    -webkit-tap-highlight-color : transparent;
  }
  
  a, a:visited {
    text-decoration: none;
    color: black;
  }

  em {
      font-style: italic;
    }

`;

export default GlobalStyle;
