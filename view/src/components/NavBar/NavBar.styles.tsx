import styled from "styled-components";

export const Nav = styled.nav`
    display: flex;
    justify-content: center;
    align-items: center;

    top: 0;
    z-index: 999;
    height: 70px;
    position: sticky;
    background-color: rgb(0, 0, 0, 0.05);

    font-size: 1.8rem;
`

export const NavContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;

    @media (max-width: 1024px) {
        justify-content: space-between;
    }
`

export const Menu = styled.ul`
    display: flex;
    justify-content: center;
    align-items: center;
    
    li {
        list-style: none;
        padding: 1rem 1.5rem;
    }

    li a {
        font-size: 1.2rem;
        cursor: pointer;
    }
`

export const Line = styled.div`
    width: 2rem;
    height: 0;
    border: 0.2px solid black;
    transform: rotate(90deg);
`

export const Icons = styled.ul`
    display: flex;
    justify-content: center;
    align-items: center;

    li {
        list-style: none;
        padding: 1rem 1.5rem;
    }

    li a {
        text-decoration: none;
        font-size: 1.6rem;
        color: black;
        padding: 0;
    }

    li svg {
        &:hover {
            cursor: pointer;
        }
    }
`