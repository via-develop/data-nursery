import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset};
  
  html,
  body {
    width: 100%;
    height: 100%;

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


  .default-input {
    border-radius: 6px;
    border: 2px solid #c9c9c9 ;
    /* padding: 23px 19px !important; */
    padding: 23px 19px;
    font-family: Pretendard;
    font-size: 20px ;
    font-weight: 400;
    outline: none;
    box-shadow: none !important;
    
    ::placeholder {
      color: #c9c9c9 !important;
    }

    :focus {
      border: 2px solid #384DC9 !important;
    }
  }

  .no-data-section {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;

    p {
      font-size: 22px !important;
      color: #737475;

    }

  }

  .loading-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pagination-wrapper {
      margin-top: 25px;
      margin-bottom: 25px;
  }

  .content-title {
    font-size: 35px;
    font-weight: 600;
    margin-bottom: 20px;
    
  }

  .manage-edit-btn {
    width: 69px;
    border-radius: 4px !important;
    border: 1px solid #C9C9C9 !important;
    padding: 6px !important;
    background-color: #fff !important;
    font-size: 14px !important;
    color: #000 !important;
    
    svg {
      margin-right: 4px;
    }
  }

  .vertical-table-edit-input {
    background-color: #F5F5F5;
    border-radius: 6px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    overflow: hidden;
    padding: 4px 2px 4px 8px;

    svg {
      cursor: pointer;
    }
    
    input {
      border: none;
      outline: none;
      background-color: inherit;
      font-size: 22px;
      color: #384DC9;

    }
  }

  .gray-border-btn {
    width: fit-content;
    border-radius: 4px !important;
    padding: 12px 20px !important;
    background-color: #fff !important;
    font-family: Pretendard;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    color: #000 !important;
    
    
    svg {
      margin-right: 10px;
      margin-bottom: 1px;
    }
  }

  .blue-btn {
    padding: 15px 24px !important;
    border-radius: 4px !important;
    font-weight: 500 !important;
    font-size: 20px !important;
    line-height: 24px !important;

    :hover,
    :focus {
    }
  }

  .default-react-quill-style {
    strong {
      font-weight: bold;
    }

    ol {
      list-style: decimal;
    }

    ul {
      list-style: disc;
    }

    /* ol li.ql-indent-1:before {
      content: counter(list-1, lower-alpha) '. ';
    } */

    /* li:not(.ql-direction-rtl)::marker {
      margin-left: -1.5rem;
      margin-right: 0.3rem;
      text-align: right !important;
      
    } */

    li.ql-indent-1:not(.ql-direction-rtl) {
      padding-left: 4.5rem;
    }
    li.ql-indent-2:not(.ql-direction-rtl) {
      padding-left: 7.5rem;
    }
    li.ql-indent-3:not(.ql-direction-rtl) {
      padding-left: 10.5rem;
    }
  }

`;

export default GlobalStyle;
