import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    html {
        font-size: 62.5%;
        background-color: var(--cyan-grayish-light);
    }
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Roboto', sans-serif;
    }
`