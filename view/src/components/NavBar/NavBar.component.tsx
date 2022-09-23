import { Nav, NavContainer, Menu, Line, Icons } from "./NavBar.styles";
import { BsFacebook, BsTwitter, BsInstagram } from "react-icons/bs";

export default function NavBar() {
    return(
        <Nav>
            <NavContainer>
                <h1>MARÉ VIVE</h1>

                <Menu>
                    <li>
                        <a>Home</a>
                    </li>
                    <li>
                        <a>Notícias</a>
                    </li>
                    <li>
                        <a>Contato</a>
                    </li>
                    <li>
                        <a>Sobre</a>
                    </li>

                    <Line />
                     
                    <Icons>
                        <li>
                            <a href="https://www.facebook.com" target="_blank">
                                <BsFacebook />
                            </a>
                        </li>
                        <li>
                            <a href="https://www.twitter.com" target="_blank">
                                <BsTwitter />
                            </a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com" target="_blank">
                                <BsInstagram />
                            </a>
                        </li>
                    </Icons>
                </Menu>


            </NavContainer>
        </Nav>
    )
}